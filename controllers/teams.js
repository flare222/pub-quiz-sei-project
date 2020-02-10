//TODO 

//* CREATE 
//* UPDATE
//* DESTROY


const Team = require('../models/team')

function create(req, res, next) {
  req.body.user = req.currentUser
  Team
    .create(req.body)
    .then(createdPub => res.status(201).json(createdPub))
    .catch(next)
}

function update(req, res, next) {
  Team
    .findById(req.params.id)
    .then(team => {
      if (!team) throw new Error('Not Found')
      if (!team.user.equals(req.currentUser._id)) return res.status(401).json({ message: 'Unauthorised' })
      Object.assign(team, req.body) 
      return team.save()  
    })
    .then(updatedTeam => res.status(202).json(updatedTeam)) 
    .catch(next)
}


function destroy(req, res) {
  Team
    .findById(req.params.id)
    .then(team => {
      if (!team) return res.status(404).json({ message: 'Not Found ' })
      if (!team.user.equals(req.currentUser._id)) {
        res.status(401).json({ message: 'Unauthorised' })
      } else {
        team.remove().then(() => res.sendStatus(204))
      }
    })
    .catch(err => res.json(err))
}

module.exports = { create, update, destroy }