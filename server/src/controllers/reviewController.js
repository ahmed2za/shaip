const Review = require('../models/Review');
const Company = require('../models/Company');
const User = require('../models/User');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.createReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { company_id, rating, title, content, images, tags } = req.body;

    // Check if user already reviewed this company
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        companyId: company_id
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'لقد قمت بتقييم هذه الشركة مسبقاً' });
    }

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      companyId: company_id,
      rating,
      title,
      content,
      images,
      tags,
      status: 'pending'
    }, { transaction });

    // Update company rating
    const company = await Company.findByPk(company_id);
    const reviews = await Review.findAll({
      where: { companyId: company_id, status: 'approved' },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
      ]
    });

    await company.update({
      averageRating: reviews[0].dataValues.averageRating || rating,
      totalReviews: (reviews[0].dataValues.totalReviews || 0) + 1
    }, { transaction });

    await transaction.commit();
    res.status(201).json(review);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إضافة التقييم' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { companyId, status = 'approved', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { status };
    if (companyId) {
      where.companyId = companyId;
    }

    const reviews = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      reviews: reviews.rows,
      total: reviews.count,
      totalPages: Math.ceil(reviews.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب التقييمات' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, title, content, images, tags } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'التقييم غير موجود' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا التقييم' });
    }

    await review.update({
      rating,
      title,
      content,
      images,
      tags
    });

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث التقييم' });
  }
};

exports.deleteReview = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'التقييم غير موجود' });
    }

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا التقييم' });
    }

    await review.destroy({ transaction });

    // Update company rating
    const company = await Company.findByPk(review.companyId);
    const reviews = await Review.findAll({
      where: { companyId: review.companyId, status: 'approved' },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
      ]
    });

    await company.update({
      averageRating: reviews[0].dataValues.averageRating || 0,
      totalReviews: Math.max((reviews[0].dataValues.totalReviews || 1) - 1, 0)
    }, { transaction });

    await transaction.commit();
    res.json({ message: 'تم حذف التقييم بنجاح' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف التقييم' });
  }
};

exports.voteHelpful = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'التقييم غير موجود' });
    }

    const helpfulVotes = new Set(review.helpfulVotes || []);
    const userId = req.user.id;

    if (helpfulVotes.has(userId)) {
      helpfulVotes.delete(userId);
    } else {
      helpfulVotes.add(userId);
    }

    await review.update({ helpfulVotes: Array.from(helpfulVotes) });
    res.json({ helpfulVotes: Array.from(helpfulVotes) });
  } catch (error) {
    console.error('Error voting review:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء التصويت على التقييم' });
  }
};

exports.reportReview = async (req, res) => {
  try {
    const { reason } = req.body;
    const review = await Review.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'التقييم غير موجود' });
    }

    const reports = [...(review.reports || []), { userId: req.user.id, reason, date: new Date() }];
    
    await review.update({ 
      reports,
      status: reports.length >= 3 ? 'reported' : review.status 
    });

    res.json({ message: 'تم الإبلاغ عن التقييم بنجاح' });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء الإبلاغ عن التقييم' });
  }
};
