const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const auth = require('../middleware/auth');

// @route   POST api/companies
// @desc    Create a company
// @access  Private
router.post('/', auth, companyController.createCompany);

// @route   GET api/companies
// @desc    Get all companies
// @access  Public
router.get('/', companyController.getCompanies);

// @route   GET api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get('/:id', companyController.getCompany);

// @route   PUT api/companies/:id
// @desc    Update company
// @access  Private
router.put('/:id', auth, companyController.updateCompany);

// @route   DELETE api/companies/:id
// @desc    Delete company
// @access  Private
router.delete('/:id', auth, companyController.deleteCompany);

module.exports = router;
