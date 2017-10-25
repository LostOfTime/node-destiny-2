/**
 * Jest unit tests
 * TODO - right now test coverage is pretty low, will work on improving
 */

const Destiny2API = require('../index.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/config.json'));

// TODO oauth config is required for some reason
const destiny = new Destiny2API({
    key: config.apikey
});

test('getManifest() - returns the API\'s manifest', () => {
    //expect.assertions(1);
    return destiny.getManifest()
        .then((res) => {
            expect(res.Response).toHaveProperty('version');
            expect(res.Response).toHaveProperty('mobileAssetContentPath');
            expect(res.Response).toHaveProperty('mobileGearAssetDataBases');
            expect(res.Response).toHaveProperty('mobileWorldContentPaths');
            expect(res.Response).toHaveProperty('mobileClanBannerDatabasePath');
            expect(res.Response).toHaveProperty('mobileGearCDN');
        });
});

// may have to move this into one test itself due to all possible enum values
test('getProfile() - returns user profile object', () => {
    return destiny.getProfile(1, '4611686018452936098', [100])
        .then((res) => {
            expect(res).toHaveProperty('profile');
            expect(res).toHaveProperty('itemComponents');
            expect(res.profile).toHaveProperty('data');
            expect(res.profile).toHaveProperty('privacy');
            expect(res.profile.data).toHaveProperty('userInfo');
            expect(res.profile.data).toHaveProperty('dateLastPlayed');
            expect(res.profile.data).toHaveProperty('versionsOwned');
            expect(res.profile.data).toHaveProperty('characterIds');
        })
})