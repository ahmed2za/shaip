const Company = require('../models/Company');
const Review = require('../models/Review');
const { Op } = require('sequelize');

exports.createCompany = async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const { category, search, sort = 'rating' } = req.query;
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    let order;
    switch (sort) {
      case 'rating':
        order = [['averageRating', 'DESC']];
        break;
      case 'reviews':
        order = [['totalReviews', 'DESC']];
        break;
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      default:
        order = [['averageRating', 'DESC']];
    }

    const companies = await Company.findAll({
      where,
      order,
      include: [{
        model: Review,
        attributes: ['rating'],
        limit: 1
      }]
    });

    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{
        model: Review,
        include: [{
          model: User,
          attributes: ['name', 'avatar']
        }]
      }]
    });

    if (!company) {
      return res.status(404).json({ message: 'الشركة غير موجودة' });
    }

    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'الشركة غير موجودة' });
    }

    // Check ownership or admin rights
    if (company.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    await company.update(req.body);
    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'الشركة غير موجودة' });
    }

    // Check ownership or admin rights
    if (company.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    await company.destroy();
    res.json({ message: 'تم حذف الشركة بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
};
