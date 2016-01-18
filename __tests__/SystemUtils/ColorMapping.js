jest.dontMock('../../util/colorMapper');

describe('colorMapper', function() {
 it('Maps a value from -5 to 5 to a color', function() {
   var mapper = require('../../util/colorMapper');
   expect((mapper.makeGradientColor(0).cssColor)).toBe("#00dba2");
 });
});
