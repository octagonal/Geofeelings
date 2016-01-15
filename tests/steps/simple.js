module.exports = function(){
  this.Given(/^I visit register$/,function(){
    this.driver.get('http://localhost:3000/signup')
  });

  this.When(/^I click Submit$/, function(){
    var F = this.Widget.Form.extend({
      root: "#my-form",
      submitSelector: function(){
        return this.find(".signup-wall button")
      }
    }).submitForm()
  });

  this.Then(/^I should see the loading screen$/, function(){
    return this.Widget.isVisible({
        selector: '#preloader'
    }).should.eventually.be.true;
});

}
