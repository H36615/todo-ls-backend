
import { Router } from 'express'

const router = Router();

export default () => {
    router.get("/test", (req, res) => {
        res.json({test: "success"})
    })
}

