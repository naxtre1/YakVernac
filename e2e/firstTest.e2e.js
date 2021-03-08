describe('GetStartedScreen test', () => {
  beforeAll(async () => {
    await device.launchApp();
  }
  );

  beforeEach(async () => {
  //  await device.reloadReactNative();
  });

  it('should have getStarted screen', async () => {
    await expect(element(by.id('getStartedScreenView'))).toBeVisible();
  });

  it('should tap Get Started button', async () => {
    await element(by.id('getStartedButton')).tap();
  });

  it('should tap Log in button', async () => {
    await element(by.id('getStartedLoginButton')).tap();
  });

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();  
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});
