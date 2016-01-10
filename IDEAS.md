//GEO STUFF

geo
  -> [loc, loc]
  -> userid
  -> timestamp

sorted
  124 50
  124 40
  124 20

query
  -> filter op locatie
  -> filter op tijd
  -> filter op user

Point representation
{
  name: "Some location"
  loc : {
    type: "Point",
    coordinates: [37.745, -55.547]
  }
}

db.places.find( { loc:
  { $geoWithin:
    { $geometry:
      { type: "Polygon",
      coordinates: [[[0,0],[0,1],[1,1],[1,0],[0,0]]]
      }
    }
  }
} )

> db.test
test.test

> db.test.insert( { location: { type: "Point", coordinates: [ -73.97, 40.77 ]}, name: "Central Park", category: "Parks" })
WriteResult({ "nInserted" : 1 })

> db.test.insert( { location: { type: "Point", coordinates: [ -73.88, 40.78 ]}, name: "La Guardia", category: "Airport" })
WriteResult({ "nInserted" : 1 })

> db.test.createIndex( { location: "2dsphere", category: -1, name: 1 } )
{
	"createdCollectionAutomatically" : false,
	"numIndexesBefore" : 1,
	"numIndexesAfter" : 2,
	"ok" : 1
}

> db.test.find( { location: { $geoWithin : { $centerSphere : [ [ -73.97, 40.77 ], 1/3963.2 ] } } } )
{ "_id" : ObjectId("566177769b0836b95b7043d2"), "location" : { "type" : "Point", "coordinates" : [ -73.97, 40.77 ] }, "name" : "Central Park", "category" : "Parks" }

> db.test.find( { location: { $geoWithin : { $centerSphere : [ [ -73.97, 40.77 ], 10/3963.2 ] } } } )
{ "_id" : ObjectId("566177769b0836b95b7043d2"), "location" : { "type" : "Point", "coordinates" : [ -73.97, 40.77 ] }, "name" : "Central Park", "category" : "Parks" }
{ "_id" : ObjectId("5661779d9b0836b95b7043d3"), "location" : { "type" : "Point", "coordinates" : [ -73.88, 40.78 ] }, "name" : "La Guardia", "category" : "Airport" }

> ^C
bye


//TIME STUFF
//
Slider
https://jsfiddle.net/7h9dx20v/1/


//Pad to full date
var currentTime = moment()
=> 2015-12-21 23:30:10
//Round to nearest day
currentTime.hour() <= 11 ? currentTime.startOf("day") : currentTime.add(1, "day").startOf("day")
=> 2015-12-22 00:00:00

//Query stuff
{
  dateRange: {                                        - Optional
      date_begin: new Date(),         // YYYY-MM-DD   - Required
      date_end:                       // YYYY-MM-DD   - Required
  }
  ,
  author: "Anthony"                   // String       - Optional
  ,
  perimeter: {                                        - Optional
      distance: 5,                    // Int          - Required
      location: [21.4545, 57.847545]  // [lat, lng]   - Required
  }
}

qs.stringify( { date_range: {begin: new Date(), end: new Date()}, author: "Anthony", perimeter: { distance: 5, location: [21.4545, 57.847545] }}, {encode: false})
=>
dateRange[begin]=2015-12-21&dateRange[end]=2015-12-22&author=Anthony&perimeter[distance]=5&perimeter[location][0]=21.4545&perimeter[location][1]=57.847545
