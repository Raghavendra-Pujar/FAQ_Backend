const express = require('express');
const router = express.Router();
const appConfig = require('../config/appConfig');
const faqController = require('../controllers/faqController');
const authorize = require('../libs/authorize')

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;

    app.post(`${baseUrl}/faq/create`,authorize.isAuthorized,faqController.createFaq);
    app.post(`${baseUrl}/faq/list`,faqController.fetchFaq);
    app.post(`${baseUrl}/faq/remove`,authorize.isAuthorized,faqController.deleteFaq);
    app.post(`${baseUrl}/faq/edit`,authorize.isAuthorized,faqController.editFaq);
    app.post(`${baseUrl}/faq/getFaq`,faqController.getFaqDetails);
}