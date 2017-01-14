import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { DateDiff } from '../../common/date'

// sass
import styles from './style.scss'

// actions and reducers
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import FollowQuestion from '../follow-question'
import AnswerItem from '../answer-item'

class QuestionsItem extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    const { question, displayCreateDate = true } = this.props

    return (
      <div key={question._id} className={styles['item-container']}>

        <div>
          {displayCreateDate ?
            <span className={styles['create-at']}>
              {DateDiff(question.create_at)}
            </span>
          : null}
          <Link to={`/people/${question.user_id._id}`}>
            <div className={styles.people}>
              <img src={question.user_id.avatar_url} />
              <span>{question.user_id.nickname}</span>
            </div>
          </Link>
          <Link to={`/question/${question._id}`}>
            <div className={styles.title}>{question.title}</div>
          </Link>
          <div className={styles.other}>
            {question.answers_count > 0 ? <span>{question.answers_count} 个回答</span> : null}
            {question.follow_count > 0 ? <span>{question.follow_count} 人关注了此问题</span> : null}
            <FollowQuestion question={question} />
          </div>
        </div>

        <div>
          {question.answers.map(answer=>{
            return (<div key={answer._id}><AnswerItem answer={answer} summary={true} /></div>)
          })}
        </div>

      </div>
    )
  }

}

QuestionsItem.propTypes = {
}

const mapStateToProps = (state, props) => {
  const { name } = props
  return {
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(QuestionsItem)