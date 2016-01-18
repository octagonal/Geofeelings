var request = require('supertest');
var app = require("../../app");
var should = require('should')

var agent = request.agent(app);

describe('Map CRUD', function(){
    it('Should only return active objects', function(done){

        agent.get('/map')
            .expect(200)
            .end(function(err, results){

                if(err){
                    console.log(err);
                }

                results.body.should.matchEach(function(it) { return it.active == true; });
                done();
            });

    });
});
