const functions = require('firebase-functions');
const admin = require('firebase-admin')
const _ = require('lodash')
const geolib = require('geolib')

admin.initializeApp()

exports.addUserLocation = functions.https.onRequest((req, res) => {
  const data = req.body.data
  const userId = req.body.userId

  return admin.database().ref('/users/' + userId).update({
    fitbit_id: data.fitbit_id,
    location: data.location
  }).then(() => {
    return res.status(200).send()
  });
});

exports.updateUserHighfives = functions.https.onRequest((req, res) => {
  const userId = req.body.userId 
  const highfives = req.body.highfives

  return admin.database().ref('/users/' + userId).update({
    highfives: highfives
  }).then(() => {
    return res.status(200).send()
  })
})

exports.setHighfive = functions.https.onRequest((req, res) => {
  const meetingId = req.query.meetingId

  admin.database().ref('/meetings/' + meetingId).set({
    highfived: true
  })
  return res.status(200).send()
})

exports.getMeetings = functions.https.onRequest((req, res) => {
  const userId = req.query.userId 
  let meetingId = 0

  admin.database().ref('/meetings').on('value', (meetings) => {
    let nextMeetingUserId = 'not-found'
    _.forOwn(meetings.val(), (meeting, id) => {
      if (meeting.highfived === false) {
        meetingId = id
        if (meeting.updatedUserID === userId) {
          nextMeetingUserId = meeting.partnerUserID
        } else if (meeting.partnerUserID === userId) {
          nextMeetingUserId = meeting.updatedUserID
        }
      }
    })
    return res.status(200).send({userId: userId, nextMeetingUserId: nextMeetingUserId, meetingId: meetingId})
  })
})

exports.updateUserLocation = functions.database.ref('/users/{userId}')
  .onUpdate((snapshot, context) => {
    const updatedUserLocation = snapshot.after.val().location
    const updatedUserID = snapshot.after.key
    return admin.database().ref('/users').on("value", (users) => {
      let smallDistances = []
      _.forOwn(users.val(), (user, id) => {
        if (id !== snapshot.after.key) {
        const distance = geolib.getDistance(
          {latitude: updatedUserLocation[0], longitude: updatedUserLocation[1]},
          {latitude: user.location[0], longitude: user.location[1]},
          1,
          3
        )
        if (distance < 200) {
          smallDistances.push({id: id, distance: distance})
        }
      }
      })
      console.log('smallDistances', smallDistances)
      smallDistances.sort((a, b) => (a.distance - b.distance))
      console.log('smallDistances 2', smallDistances)
      return admin.database().ref('/meetings').push({
        updatedUserID: updatedUserID,
        partnerUserID: smallDistances[0].id,
        highfived: false
      })
    })
  });
