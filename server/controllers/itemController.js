const router = require('express').Router();
const { isUser } = require('../middlewares/guards.js');
const { parseError } = require('../util/parsers.js');

router.get('/', async (req, res) => {
    
    
    try {
        const item = await req.storage.getAllItems(req.query);  // todo
        res.status(200).json(item);
      
    } catch(err) {
        const message = parseError(err);
        res.status(err.status || 400).json({ message });
        console.log(err.message);
    }
});

router.post('/', isUser(), async (req, res) => {  
   
    const itemData = {
            title: req.body.title,
            year: req.body.year,
            price: Number(req.body.price), //  currency
            category: req.body.category,
            condition: req.body.condition,
            frameSize: req.body['frame-size'],
            wheelSize: req.body['wheel-size'],
            material: req.body.material.trim(),
            frontTravel: req.body['front-travel'],
            rearTravel: req.body['rear-travel'],
            location: req.body.location,
            postDate: new Date(),
            description: req.body.description,
            image: req.body.image,
            owner: req.user._id, 
    };

    try {
        const item = await req.storage.createItem(itemData);
        res.status(201).json(item);
        
    } catch(err) {
        const message = parseError(err);
        res.status(err.status || 400).json({ message });

        console.log(err.message);

    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await req.storage.getItemById(req.params.id);
           
         let itemData = {...item, owner: item.owner}
       
        res.json(itemData)
      
    }catch(err) {
        console.log(err.message);
        res.status(err.status || 400).json( err.message );
     
    }
});


router.put('/:id', isUser(), async (req, res) => {    // isOwner
    try {
        const item = await req.storage.getItemById(req.params.id);

        if (req.user._id != item.owner._id) {         // TODO  PROMENIH !!!!!
            throw new Error('You haven\'t created it!!');    // TODO
        }
        
        const newData = {
            title: req.body.title,
            year: req.body.year,
            price: Number(req.body.price), //  currency
            category: req.body.category,
            condition: req.body.condition,
            frameSize: req.body['frame-size'],
            wheelSize: req.body['wheel-size'],
            material: req.body.material,
            frontTravel: req.body['front-travel'],
            rearTravel: req.body['rear-travel'],
            location: req.body.location,
            // no PostDate
            description: req.body.description,
            image: req.body.image,
        };
        const updatedItem = await req.storage.editItem(req.params.id, newData);

        res.json(updatedItem)
        
    } catch(err) {
        console.log(err.message);
        res.status(err.status || 400).json( err.message );
      
    }
});

router.delete('/:id', isUser(), async (req, res) => {
    try {
        const item = await req.storage.getItemById(req.params.id);
        console.log('bike.owner')
        console.log(item.owner)
        if ( item.owner._id != req.user._id) {          // TODO
            throw new Error('You haven\'t created it!');   // TODO
        }

        await req.storage.deleteItem(req.params.id);
        console.log('deleted')
        res.status(204).json();
    } catch(err) {
        console.log(err.message);
        res.status(err.status || 400).json( err.message );
       
    }
});


module.exports = router;

