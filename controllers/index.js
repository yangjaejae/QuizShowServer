const express = require('express');

const dapp = require('../eth/dapp');
const QuizInformation = require('../models').QuizInformation;
const QuizList = require('../models').QuizList;
const QuizAnswerList = require('../models').QuizAnswerList;

const router = express.Router();
  
  router.get('/show', async function (req, res, next) {
    try {
      const quizInfo = await QuizInformation.findOne({
        where: { state: 0 },
        limit: 1, 
        order: [
          ['startDate', 'ASC'],
        ],
      });
      if (quizInfo != null) {
        newQuiz = JSON.parse(JSON.stringify(quizInfo));
        newQuiz.round = quizInfo.id;
        console.log(newQuiz);
        res.status(201).json(newQuiz);
      } else {
        res.status(201).json({});
      }
      
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  router.get('/quiz/:round', async function (req, res, next) {
    try {
      const quizInfo = await QuizInformation.findOne({
        where: { id: req.params.round }
      });
      const quizList = await QuizList.findAll({
        where: { round: req.params.round }
      });
      console.log(quizInfo);
      console.log(quizList);
      res.status(201).json(quizInfo);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  router.get('/quiz/list/:round', async function (req, res, next) {
    try {
      const quizList = await QuizList.findAll({
        where: { round: req.params.round },
        include: {model: QuizAnswerList}
      });
      console.log(quizList);
      // req.session.attend = req.session.attend + 1;
      res.status(201).json(quizList);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

router.get('/showlist', (req, res) => {
    console.log('request quiz list');

    dapp.getQuizShowList(function (err, list) {
        console.log(list);
        res.write(JSON.stringify({success: true, lists:list},null,2));
        res.end();
    });
});

// 퀴즈게임 접수 : 일시 20190312120000, 상품 QC, 상금 1000000000, 상태 0)
//   state  상태 : 0 - 대기, 1 - 게임시작, 2-게임종료, 3- 정산종료
// ------------------------------------------------------------------------
router.post('/show', (req, res, next) => {
    let newShow = {
        datetime: req.body.datetime,
        prizeKind: req.body.prizeKind,
        amount: req.body.amount
    };
    
    dapp.reserveQuizShow(newShow, function (err) {
        if (err) {
            res.json({success:false, message: "reserve Quiz error"});
        }
        res.json({success:true, message: "reserve Quiz success"});
    });
});

module.exports = router;