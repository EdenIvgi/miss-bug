import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

import { pdfService } from './services/pdf.service.js'

import path from 'path';
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// App Configuration

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Basic - Routing in express
// Real routing express
// List
app.get('/api/bug', (req, res) => {
    const { txt, sortBy, sortDir, pageIdx, minSeverity } = req.query



    const filter = {
        txt: txt || '',
        minSeverity: parseInt(minSeverity) || 0
    }

    const sort = {
        sortBy: sortBy,
        sortDir: parseInt(sortDir) || 1
    }

    const page = {
        pageIdx: parseInt(pageIdx) || 0
    }


    // res.cookie('test',123)
    bugService.query(filter, sort, page).then(bugs => {

        res.send(bugs)

    }).catch((err) => {
        loggerService.error('Cannot get bugs', err)
        res.status(400).send('Cannot get bugs')
    })
})

app.get('/api/bug/totalBugs', (req, res) => {

    bugService.getTotalCount().then((count) => {
        res.status(200).json(count);
    })

        .catch((err) => {
            loggerService.error('Cannot get total bugs', err)
            res.status(503).send('Cannot get total bugs')
        })
})

// Read - getById
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    console.log(req.cookies.visitedBugs);

    let visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length > 3) {
        return res.status(401).send('Wait for a bit')
    }
    visitedBugs = [...visitedBugs, bugId]
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

//UPDATE
app.put('/api/bug/', (req, res) => {

    loggerService.debug('req.body', req.body)

    const { title, description, severity, _id } = req.body


    const bug = {
        _id,
        title,
        description,
        severity: +severity,
    }

    bugService.save(bug)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.post('/api/bug/', (req, res) => {

    loggerService.debug('req.body', req.body)
    const bug = bugService.getEmptyBug(req.body)


    bugService.save(bug)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})





// Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.remove(bugId).then(() => {
        loggerService.info(`Bug ${bugId} removed`)
        res.send('Removed!')
    }).catch(err => {
        loggerService.error('Cannot get bug', err)
        res.status(400).send('Cannot get bug')
    })
})

app.get('/file/:fileType', (req, res) => {
    const { fileType } = req.params

    if (fileType === 'pdf') {

        pdfService.createPdf()
        console.log('PDF created successfully');
        const filePath = path.join(__dirname, 'output.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=output.pdf');
        res.sendFile(filePath);
    }

})




// Listen will always be the last line in our server!
const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://localhost:${port}/`)
)