const Company = require("../models/companies.model");

class CompanyDomain {
  // create Company

  async createAnCompany(req, res) {
    var data = req.body;

    const result = await Company.findById({_id: data._id})

    if(result) return res.status(500).send({ msg: `This Company id ${data._id} already exists` });

    let company = new Company({...data});

    const NewCompany = await company.save();

    if (!NewCompany)
      return res.status(500).send({ msg: `Can't create Company` });
    res.status(200).send(NewCompany);
  }

  // get all Company
  async getAllCompany(req, res) {
    var data = await Company.find({IsActive: true});

    if (data.length <= 0)
      return res.status(500).send({ msg: `Company not found` });
    res.status(200).send({CompanyList: data});
  }

  // get specific Company by id
  async getAnCompany(req, res) {
    var id = req.params.id;

    const result = await Company.findById(id);

    if (!result || !result.IsActive) return res.status(500).send({ msg: `Company not found` });
    res.status(200).send(result);
  }

  // Soft delete Company by id
  async deleteAnCompany(req, res) {
    var id = req.params.id;
    const company = await Company.findById(id);

    if (!company)
      return res.status(500).send({ msg: `Company not found` });

    const result = await Company.findByIdAndUpdate(
      id,
      {
        $set: {
          IsActive: false,
        },
      },
      { new: true }
    );

    if (!result)
      return res.status(500).send({ msg: `Can't delete Company` });
    res.status(200).send("Successfully deleted");
  }

  // Hard delete Company by id
  async HardDeleteAnCompany(req, res) {
    var id = req.params.id;

    const result = await Company.findByIdAndDelete(id);

    if (!result) return res.status(500).send({ msg: `Company not found` });
    res.status(200).send("Hard delete Successfully");
  }

  //  Edit Company
  async editAnCompany(req, res) {
    var data = req.body;
    var id = req.params.id;

    const company = await Company.findById(id);

    if (!company)
      return res.status(500).send({ msg: `Company not found` });
    const UpdateCompany = await Company.findByIdAndUpdate(
      id,
      {
        $set: { ...data },
      },
      { new: true }
    );

    if (!UpdateCompany)
      return res.status(500).send({ msg: `Can't update Company` });
    res.status(200).send(UpdateCompany);
  }
}

module.exports = CompanyDomain;
