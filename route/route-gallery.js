'use strict';

const Gallery = require('../model/gallery');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const ERROR_MESSAGE = 'Authorization Failed';


module.exports = router => {
  router.route('/gallery/:id?')
    .post(bearerAuthMiddleware,bodyParser,(request,response) => {
      request.body.userId = request.user._id;

      return new Gallery(request.body).save()
        .then(createdGallery => response.status(201).json(createdGallery))
        .catch(error => errorHandler(error,response));
    })

    .get(bearerAuthMiddleware,(request,response) => {
      if(request.params.id){
        return Gallery.findById(request.params.id)
          .then(gallery => response.status(200).json(gallery))
          .catch(error => errorHandler(error,response));
      }

      return Gallery.find()
        .then(galleries => {
          let galleriesIds = galleries.map(gallery => gallery._id);

          response.status(200).json(galleriesIds);
        })
        .catch(error => errorHandler(error,response));
    })
    .put(bearerAuthMiddleware, bodyParser, (request,response) => {
      Gallery.findOne({
        userId: request.user._id,
        _id: request.params.id,
      })
        .then(gallery => {
          // console.log('gallery route', gallery);
          if(!gallery) return Promise.reject(new Error('Authorization Error.'));
          return gallery.set(request.body).save();
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error, response));
    })

    .delete(bearerAuthMiddleware,(request,response) => {
      return Gallery.findById(request.params.id)
        .then(gallery => {
          if(gallery.userId.toString() === request.user._id.toString())
            return gallery.remove();

          return errorHandler(new Error(ERROR_MESSAGE),response);
        })
        .then(() => response.sendStatus(204))
        .catch(error => errorHandler(error,response));
    });
};