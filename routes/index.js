const express = require('express');
const router = express.Router();
const path = require('path');
const Judet = require('../models/Judet');

// Welcome Page
router.get('/', (req, res) => {

    res.sendFile(path.join(__dirname + '/../public/index.html'));
});

// REST API pentru judete
router.get('/judete', (req, res) => {

    Judet.find({})
        .then(judete => {

            res.json({
                'success': true,
                'result': judete
            });
        })
        .catch(err => {

            res.json({
                'success': false,
                'error': err
            });
        });
});

router.get('/judete/:id', (req, res) => {

    Judet.findOne({id: req.params.id})
        .then(judet => {

            if (judet) {

                res.json({
                    'success': true,
                    'result': judet
                });
            } else {

                res.json({
                    'success': false,
                    'message': `Nu exista judet cu id-ul ${req.params.id}`
                });
            }
        })
        .catch(err => {

            res.json({
                'success': false,
                'error': err
            })
        });
});

router.post('/judete/:id', (req, res) => {

    const {judet, culturaPredominanta, umiditate, humus, culturi, coordonate} = req.body;

    Judet.findOne({id: req.params.id}).then(result => {

        if (result) {

            res.json({
                'success': false,
                'message': `Judet cu id-ul ${req.params.id} exista deja` 
            });
        } else {

            const judetNou = new Judet({
                id: req.params.id,
                judet: judet,
                culturaPredominanta: culturaPredominanta,
                umiditate: umiditate,
                humus: humus,
                culturi: culturi,
                coordonate: coordonate
            });

            judetNou.save()
                .then(judet => {

                    res.json({
                        'success': true,
                        'judet': judet
                    });
                })
                .catch(err => {

                    res.json({
                        'success': false,
                        'message': 'Judetul nu a putut fi adaugat',
                        'error': err
                    });
                });
        }
    });
});

router.delete('/judete/:id', (req, res) => {

    Judet.deleteOne({id: req.params.id})
        .then(result => {

            res.json({
                'success': true,
                'result': result
            });
        })
        .catch(err => {

            res.json({
                'success': false,
                'error': err
            })
        });
});

router.put('/judete/:id', (req, res) => {

    Judet.updateOne({id: req.params.id}, req.body)
        .then((judet) => {
            
            res.json({
                'success': true,
                'judet': judet
            });
        })
        .catch(err => {

            res.json({
                'success': true,
                'error': err
            });
        });
});

module.exports = router;
