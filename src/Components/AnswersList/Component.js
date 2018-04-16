import React from 'react';
import styled, { css } from 'styled-components';


const Answers = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
`;


const Answer = styled.li`
  display: flex;
  flex-direction: row;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;


const Votes = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-basis: 10%;
  margin-right: 10px;
`;


const Vote = styled.button`
  display: flex;
  width: 100%;
  align-self: center;
  font-weight: 700;
  justify-content: space-between;
  border: none;
  background: #ff9f00;
  color: #000;
  padding: 3px 5px 3px 8px;
  transition: color, background 50ms;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  &:active {
    color: #fff;
    background: #ff6500;
  }
  
  &[disabled] {
    background: gainsboro;
    color: #0d0045;
  }
  ${({ up }) => up ? css`
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid #000;
  ` : css`
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top: 1px solid #000;
  `}

  @media (min-width: 760px) {
    & {
      width: 60%;
    }
  }
`;


const AnswerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 90%;
`;

const AnswerBody = styled.div`
  display: flex;
  font-size: 11pt;
  margin-bottom: 10px;
`;

const AnswerBottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;


const AnswerBottom = styled.span``;


const votesByAnswerId = (votes, answerId) => votes.filter(vote => vote.answerId === answerId);

const divideVotes = votes => {
  const positive = votes.filter(vote => vote.isPositive).length;
  const negative = votes.length - positive;
  return { positive, negative };
};


const divideByAnswerId = (votes, answerId) => divideVotes(votesByAnswerId(votes, answerId));

const sortAnswers = (answers, votes, sortBy) => {
  switch (sortBy) {
    case 'createdAt':
      return answers.sort((answerA, answerB) => {
        return answerA.createdAt < answerB.createdAt;
      });
      break;
    case 'best':
      return answers.sort((answerA, answerB) => {
        const positiveA = divideByAnswerId(votes, answerA._id).positive;
        const positiveB = divideByAnswerId(votes, answerB._id).positive;
        const negativeA = divideByAnswerId(votes, answerA._id).negative;
        const negativeB = divideByAnswerId(votes, answerB._id).negative;

        if (positiveA != positiveB) {
          return positiveA < positiveB;
        } else {
          return negativeA > negativeB;
        }
      });
      break;
    case 'worst':
      return answers.sort((answerA, answerB) => {
        const positiveA = divideByAnswerId(votes, answerA._id).positive;
        const positiveB = divideByAnswerId(votes, answerB._id).positive;
        const negativeA = divideByAnswerId(votes, answerA._id).negative;
        const negativeB = divideByAnswerId(votes, answerB._id).negative;

        if (negativeA != negativeB) {
          return negativeA < negativeB;
        } else {
          return positiveA > positiveB;
        }
      });
      break;
    default:
      return answers
  }
};

const getAuthor = (users, authorId) => users.find(user => user._id === authorId)
  || { profile: { fullName: 'Anonymous' } };

const AnswersList = ({ answers, votes, users, onVote, user, sortBy }) => (
  <Answers>
    {sortAnswers(answers, votes, sortBy).map(answer => {
      const { positive, negative } = divideByAnswerId(votes, answer._id);
      const author = getAuthor(users, answer.createdById);
      return (
        <Answer key={answer._id}>
          <Votes>
            <Vote up disabled={!user} onClick={() => onVote(answer._id, true)}>
              <span>{positive}</span><span>▲</span>
            </Vote>
            <Vote disabled={!user} onClick={() => onVote(answer._id, false)}>
              <span>{negative}</span><span>▼</span>
            </Vote>
          </Votes>

          <AnswerWrapper>
            <AnswerBody>{answer.title}</AnswerBody>

            <AnswerBottomWrapper>
              <AnswerBottom>
                By: <strong>{author.profile.fullName}</strong>
              </AnswerBottom>

              <AnswerBottom>
                {answer.createdAt.toLocaleDateString()}
              </AnswerBottom>
            </AnswerBottomWrapper>
          </AnswerWrapper>
        </Answer>
      )}
    )}
  </Answers>
);


export default AnswersList;
