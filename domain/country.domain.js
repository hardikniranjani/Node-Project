const Country = require("../models/country.model");

class CountryDomain {
  // create Country
  async createCountry(req, res) {
    var data = req.body;

    let country = new Country({
      _id: data._id,
      CountryName: data.CountryName,
      CountryShortForm: data.CountryShortForm,
      CountryCode: data.CountryCode,
    });

    const NewCountry = new country.save();
    if (NewCountry) {
      res.send(NewCountry);
    } else {
      res.send("can't create country");
    }
  }

  // get all country
  async getAllCountry(req, res) {
    var data = await Country.find();

    if (data.length > 0) {
      res.send(data);
    } else {
      res.send("No country found");
    }
  }

  // get specific country by id
  async getAnCountry(req, res) {
    var id = req.params.id;

    const result = await Country.findById(id);

    if (result) {
      res.send(result);
    } else {
      res.send("No country found");
    }
  }

  // Soft delete Country by id
  async deleteAnCountry(req, res) {
    var id = req.params.id;
    const Country = await Country.findById(id);
    if (Country) {
      const result = await Country.findByIdAndUpdate(
        id,
        {
          $set: {
            IsActive: false,
          },
        },
        { new: true }
      );

      if (result) {
        res.send("Successfully deleted");
      } else {
        res.status(404).send("Country not found");
      }
    } else {
      res.status(404).send("Country not found");
    }
  }

  // Hard delete Country by id
  async HardDeleteAnCountry(req, res) {
    var id = req.params.id;

    const result = await Country.findByIdAndDelete(id);

    if (result) {
      res.send("Successfully deleted");
    } else {
      res.status(404).send("Country not found");
    }
  }

  //  Edit Country

  async editAnCountry(req, res) {
    var data = req.body;
    var id = req.params.id;

    const country = await Country.findById(id);

    if (country) {
      const UpdateCountry = await Country.findByIdAndUpdate(
        id,
        {
          $set: {
            _id: data._id,
            CountryName: data.CountryName,
            CountryShortForm: data.CountryShortForm,
            CountryCode: data.CountryCode,
          },
        },
        { new: true }
      );

      if (UpdateCountry) {
        res.send(UpdateCountry);
      } else {
        res.send("Can't update Country");
      }
    } else {
      res.send("Country not found");
    }
  }
}

module.exports = CountryDomain;