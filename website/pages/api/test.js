import { findErrors } from '../../lib/visitor'

export default function handler(req, res) {
    if (req.method === 'POST') {
      //let start = Date.now()
      let battle = findErrors(req.body)
      //console.log(Date.now() - start)
      res.status(200).json(battle)
    } 
  }