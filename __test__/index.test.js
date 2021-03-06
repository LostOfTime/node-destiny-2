/**
 * Jest unit tests
 * TODO - test rejections for formatJson
 */
const Destiny2API = require('../index.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/config.json'));

const destiny = new Destiny2API({
    key: config.apikey
});

test('Destiny2API empty config tests', () => {
    const emptyDestiny = new Destiny2API();
    expect(emptyDestiny.key).toEqual(undefined);
});

test('Destiny2API config tests', () => {
    const testiny = new Destiny2API({
        key: config.apikey
    });
    // not sure if this is redundant, may add other tests 
    expect(testiny.key).toEqual(config.apikey);
});

test('toQueryString test', () => {
    const toQueryString = require('../lib/format-querystring.js');
    const queryString = toQueryString({ components: [100, 101], page: [2], modes: [12,43] });
    expect(queryString).toEqual('?components=100,101&page=2&modes=12,43');
});

test('async https rejection test', () => {
    const promiseRequest = require('../lib/async-https.js');
    return promiseRequest({}, (res, resolve, reject) => {})
        .catch((error) => {
            // not sure if this test is that useful
            expect(error).toEqual('connect ECONNREFUSED 127.0.0.1:443')
        });
});

test('getManifest returns the API\'s manifest', () => {
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

test('getDestinyEntityDefinition returns static definition of entity', () => {
    return destiny.getDestinyEntityDefinition('DestinyInventoryItemDefinition', '2907129557')
        .then((res) => {
            expect(res.Response).toHaveProperty('hash');
            expect(res.Response.hash).toEqual(2907129557);
        });
});

test('searchDestinyPlayer returns list of memberships tied to account', () => {
    return destiny.searchDestinyPlayer(-1, 'Roflz1lla')
        .then((res) => {
            expect(res.Response).toMatchObject([
                {
                    iconPath: '/img/theme/destiny/icons/icon_xbl.png',
                    membershipType: 1,
                    membershipId: '4611686018452936098',
                    displayName: 'Roflz1lla'
                }
            ])
        });
});

// may have to move this into one test itself due to all possible enum values
test('getProfile returns user profile object', () => {
    return destiny.getProfile(1, '4611686018452936098', [100])
        .then((res) => {
            expect(res.Response).toHaveProperty('profile');
            expect(res.Response).toHaveProperty('itemComponents');
            expect(res.Response.profile).toHaveProperty('data');
            expect(res.Response.profile).toHaveProperty('privacy');
            expect(res.Response.profile.data).toHaveProperty('userInfo');
            expect(res.Response.profile.data).toHaveProperty('dateLastPlayed');
            expect(res.Response.profile.data).toHaveProperty('versionsOwned');
            expect(res.Response.profile.data).toHaveProperty('characterIds');
        });
});

test('getCharacter returns character object', () => {
    return destiny.getCharacter(1, '4611686018452936098', '2305843009278477570', [200])
        .then((res) => {
            expect(res.Response).toHaveProperty('character');
            expect(res.Response.character).toHaveProperty('data');
            expect(res.Response.character.data).toHaveProperty('characterId');
            expect(res.Response.character.data.characterId).toEqual('2305843009278477570');
        });
});

test('getClanWeeklyRewardState returns the current clan progress', () => {
    return destiny.getClanWeeklyRewardState('206662')
        .then((res) => {
            expect(res.Response).toHaveProperty('milestoneHash');
            expect(res.Response.milestoneHash).toEqual(4253138191); // this may change not sure
            expect(res.Response).toHaveProperty('rewards');
            expect(res.Response).toHaveProperty('startDate');
            expect(res.Response).toHaveProperty('endDate');
        });
});

test('getItem return a object with a specific item\'s info from my inventory', () => {
    return destiny.getItem(1, '4611686018452936098', '6917529034457803619', [300])
        .then((res) => {
            expect(res.Response).toHaveProperty('characterId');
            expect(res.Response.characterId).toEqual('2305843009278477570');
            expect(res.Response).toHaveProperty('instance');
            // not sure if needed
            expect(res.Response.instance.data.damageTypeHash).toEqual(3373582085);
        });
});

// getVendors (BETA) endpoint not active yet

// getVendor (BETA) endpoint not active yet

test('getPostGameCarnageReport for activityId 328104460', () => {
    return destiny.getPostGameCarnageReport('328104460')
        .then((res) => {
            expect(res.Response).toHaveProperty('period');
            expect(res.Response).toHaveProperty('activityDetails');
            expect(res.Response).toHaveProperty('entries');
            expect(res.Response).toHaveProperty('teams');
            // not sure if these tests are required but I guess it doesn't hurt
            expect(res.Response.activityDetails.referenceId).toEqual(1720510574);
            expect(res.Response.activityDetails.directorActivityHash).toEqual(3243161126);
            expect(res.Response.activityDetails.instanceId).toEqual('328104460');
        });
});

test('searchDestinyEntities returns page list for MIDA Multi-tool search', () => {
    return destiny.searchDestinyEntities('DestinyInventoryItemDefinition', 'MIDA Multi-Tool', [0])
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            expect(res.Response).toHaveProperty('suggestedWords');
            expect(res.Response).toHaveProperty('results');
        });
});

test('getHistoricalStats returns object containing historical stats for account for allPvE', () => {
    return destiny.getHistoricalStats(1, 
                                      '4611686018452936098', 
                                      '2305843009278477570', 
                                      { modes: [7] })
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            expect(res.Response).toHaveProperty('allPvE');
            expect(res.Response.allPvE).toHaveProperty('allTime');
        });
});

test('getHistoricalStatsForAccount returns aggregated stats for account', () => {
    return destiny.getHistoricalStatsForAccount(1, '4611686018452936098')
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            expect(res.Response).toHaveProperty('mergedDeletedCharacters');
            expect(res.Response).toHaveProperty('mergedAllCharacters');
            expect(res.Response).toHaveProperty('characters');
        });
});

test('getActivityHistory returns object containing 5 most recent PvE activities for char', () => {
    return destiny.getActivityHistory(1, 
                           '4611686018452936098', 
                           '2305843009278477570', 
                           { count: [5], mode: [7] })
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            expect(res.Response).toHaveProperty('activities');
            expect(res.Response.activities.length).toEqual(5);
        });
});

test('getUniqueWeaponHistory returns object w/ weapon stats for specific character' , () => {
    return destiny.getUniqueWeaponHistory(1, '4611686018452936098', '2305843009278477570')
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            expect(res.Response).toHaveProperty('weapons');
        });
});

test('getDestinyAggregateActivityStats returns all stats for all activities done by char', () => {
    return destiny.getDestinyAggregateActivityStats(1, '4611686018452936098', '2305843009278477570')
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            expect(res.Response).toHaveProperty('activities');
            expect(res.Response.activities.length).toEqual(34); // unsure if this changes
        })
});

test('getHistoricalStatsDefinition returns historical stats definitions', () => {
    return destiny.getHistoricalStatsDefinition()
        .then((res) => {
            expect(res.ErrorCode).toEqual(1); // success
        });
});

test('getClanLeaderboards test', () => {
    destiny.getClanLeaderboards('206662')
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            // since response is {} for now I won't test anything else
        });
});

test('getClanAggregateStats returns aggregated clan stats', () => {
    return destiny.getClanAggregateStats('206662')
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
            expect(res.Response.length).toEqual(44);
        });
});

// hash is a clan's weekly rewards progress
test('getPublicMilestoneContent for the hash 4253138191', () => {
    return destiny.getPublicMilestoneContent('4253138191')
        .then((res) => {
            expect(res.Response).toHaveProperty('about');
            expect(res.Response).toHaveProperty('status');
            expect(res.Response).toHaveProperty('tips');
        });
})

// since these always change we just check error code for success
test('getPublicMilestones returns list of current milestones', () => {
    return destiny.getPublicMilestones()
        .then((res) => {
            expect(res.ErrorCode).toEqual(1);
        });
});