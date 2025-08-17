import cookieParser from 'cookie-parser'
import express from 'express'
import path from 'path'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())



//* ------------------- REST API for Bugs -------------------
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || 0,
        labels: req.query.labels || '',
        userId: req.query.userId || '',
    }
    const sortBy = {
        type: req.query.type || '',
        desc: req.query.desc || 1,
    }
    if (req.query.pageIdx) filterBy.pageIdx = req.query.pageIdx
    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bug/pdf', (req, res) => {
    bugService.getPdf()
        .then((result) => res.send(result))
        .catch(err => {
            loggerService.error('Cannot download Buds Pdf', err)
            res.status(400).send('Cannot download Buds Pdf')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitedBugIds = req.cookies.visitedBugIds || []
    if (!visitedBugIds.includes(bugId)) visitedBugIds.push(bugId)
    if (visitedBugIds.length > 3) {
        return res.status(401).send('Wait for a bit')
    }
    bugService.getById(bugId)
        .then(bug => {
            res.cookie('visitedBugIds', visitedBugIds, { maxAge: 1000 * 10 })
            res.send(bug)
        })
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(401).send('Cannot get bug')
        })
})


app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => res.send(`Bug id : ${bugId} deleted`))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(401).send('Cannot remove bug')
        })
})

app.post('/api/bug', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bug = req.body
    delete loggedinUser.username
    bug.creator = loggedinUser

    bugService.save(bug, loggedinUser)
        .then(addedBug => res.send(addedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.put('/api/bug', (req, res, next) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const bug = req.body
    bugService.save(bug, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Had issues:', err)
            res.status(400).send('Cannot save bug')
        })
})

//* ------------------- User API -------------------
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(500).send('Cannot get users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot get user:', err)
            res.status(500).send('Cannot get user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { loginToken } = req.cookies
    const loggedinUser = authService.validateToken(loginToken)

    if (!loggedinUser || !loggedinUser.isAdmin) return res.status(401).send('Cannot remove user')
    const { userId } = req.params

    bugService.hasBugs(userId)
        .then(() => userService.remove(userId))
        .then(() => res.send('Removed!'))
        .catch(err => {
            loggerService.error('Cannot delete user!', err)
            res.status(401).send('Cannot delete user!')
        })
})


//* ------------------- Auth API -------------------

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    console.log('🚀 ~ req.body:', req.body)
    // console.log('credentials:', credentials)

    userService.signup(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(401).send('Cannot signup')
        })
})


app.post('/api/auth/login', (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }
    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot login', err)
            res.status(401).send('Cannot login')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})




// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
})

