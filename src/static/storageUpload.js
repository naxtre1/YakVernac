import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'

export default function storageUpload(uid, ref, path, type, id, lang) {
    if (path) {
        const re = /(?:\.([^.]+))?$/
        const extension = re.exec(path)[1]
        const childPath = uid+`/${Date.now().toString()}.`+extension
        const storageRef = storage().ref(ref).child(childPath)
        return new Promise((resolve, reject) => {
            storageRef.putFile(path).then(() => {
                storageRef.getDownloadURL().then(url=>{
                    firestore().collection('user').doc(uid).collection('media').add({
                        url,
                        type: 'lesson',
                        content: 'image',
                        lang,
                        bookmark: false,
                        time: Date.now()
                    }).then(()=>{
                        resolve(url)
                    })
                })
            }).catch(error=>{
                reject(error)
            })
        
        })
    
    }
    return new Promise((resolve, reject)=>{
        resolve('')
    })

}