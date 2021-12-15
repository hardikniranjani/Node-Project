const Genre = require('../models/genres.model');

class GenreDomain {
 // create Genre

 async createGenre(req, res) {
    var data = req.body;

    let genre = new Genre({
      _id: data._id,
      GenreName: data.GenreName,
    });

    const NewGenre = await genre.save();
    if (NewGenre) {
      res.send(NewGenre);
    } else {
      res.send("can't create Genre");
    }
  }

  // get all categories
  async getAllCategories(req, res) {
    var data = await Genre.find();

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send("No categories found");
    }
  }

  // get specific Genre by id
  async getAnGenre(req, res) {
    var id = req.params.id;

    const result = await Genre.findById(id);

    if (result) {
      res.send(result);
    } else {
      res.send("No categories found");
    }
  }

  // Soft delete Genre by id
  async deleteAnGenre(req, res) {
    var id = req.params.id;
    const Genre = await Genre.findById(id);
    if(Genre) {
      const result = await Genre.findByIdAndUpdate(id,
        {
          $set:{
            IsActive:false,
          }
        },{ new: true });

        if (result) {
          res.send("Successfully deleted");
        } else {
          res.status(404).send("Genre not found");
        }
    }
    else{
      res.status(404).send("Genre not found");
    }
    


  }

  // Hard delete Genre by id
  async HardDeleteAnGenre(req, res) {
    var id = req.params.id;

    const result = await Genre.findByIdAndDelete(id);

    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Genre not found");
    }
  }

  //  Edit Genre

  async editAnGenre(req, res) {
    var data = req.body;
    var id = req.params.id;

    const Genre = await Genre.findById(id);

    if (Genre) {
      const UpdateGenre = await Genre.findByIdAndUpdate(
        id,
        {
          $set: {
            _id: data._id,
            GenreName: data.GenreName,
          },
        },
        { new: true }
      );

      if (UpdateGenre) {
        res.send(UpdateGenre);
      } else {
        res.send("Can't update Genre");
      }
    } else {
      res.send("Genre not found");
    }
  }
}

module.exports = GenreDomain ;