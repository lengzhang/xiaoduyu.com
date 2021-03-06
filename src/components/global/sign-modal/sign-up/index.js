import React, { Component } from 'react'

// tools
import Device from '../../../../common/device'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signIn, signUp } from '../../../../actions/sign'

// components
import CaptchaButton from '../../../captcha-button';
import CountriesSelect from '../../../countries-select';

// styles
import CSSModules from 'react-css-modules'
import styles from './style.scss'

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    signUp: bindActionCreators(signUp, dispatch),
    signIn: bindActionCreators(signIn, dispatch)
  })
)
@CSSModules(styles)
export default class SignUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      areaCode: '',
      type:'phone',
      show: false
    }
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  componentDidMount() {

    this.setState({
      show: true
    });

  }

  async submit(event) {

    event.preventDefault();

    let self = this;


    let { nickname, account, password, male, female, captcha } = this.refs;

    const { areaCode } = this.state;
    const { signUp, signIn } = this.props;

    if (!nickname.value) return nickname.focus();
    if (!account.value) return account.focus();
    if (!captcha.value) return captcha.focus();
    if (!password.value) return password.focus();
    if (!male.checked && !female.checked) {
      Toastify({
        text: '请选择性别',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return
    }

    let data = {
      nickname: nickname.value,
      password: password.value,
      gender: male.checked ? 1 : 0,
      source: parseInt(Device.getCurrentDeviceId()),
      captcha: captcha.value
    }

    if (account.value.indexOf('@') != -1) {
      data.email = account.value
    } else {
      data.phone = account.value
      data.area_code = areaCode
    }

    let [ err, res ] = await signUp(data);

    if (err) {
      Toastify({
        text: err && err.message ? err.message : err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return;
    } else {
      Toastify({
        text: '注册成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
    }

    delete data.nickname;
    delete data.gender;
    delete data.source;
    delete data.captcha;
    delete data.area_code;

    [ err, res ] = await signIn({ data });

    if (err) {

      $('#sign').modal('hide');
      setTimeout(()=>{
        $('#sign').modal({ show: true }, { 'data-type': 'sign-in' });
      }, 700);

    }

  }

  sendCaptcha(callback) {

    const { account } = this.refs;
    const { areaCode } = this.state;

    if (!account.value) return account.focus();

    let params = { type: 'sign-up' }

    if (account.value.indexOf('@') != -1) {
      params.email = account.value;
    } else {
      params.area_code = areaCode;
      params.phone = account.value;
    }

    callback({
      args: params
    });
  }

  render () {
    const self = this;
    const { type, show } = this.state;

    return (
      <div styleName="signup">

        <div><input type="text" className="form-control" ref="nickname" placeholder="名字" /></div>

        {type == 'phone' ?
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-4"><CountriesSelect onChange={(res)=>{ self.state.areaCode = res }} /></div>
              <div className="col-8"><input type="text" className="form-control" ref="account" placeholder="手机号" /></div>
            </div>
          </div>
          :
          <div>
            <input type="text" className="form-control" ref="account" placeholder="邮箱" />
          </div>}

        <div>
          <input type="text" className="form-control" placeholder="输入 6 位验证码" ref="captcha" />
          <span styleName="captcha-button">{show ? <CaptchaButton onClick={this.sendCaptcha} /> : null}</span>
        </div>

        <div><input type="password" className="form-control" ref="password" placeholder="密码" /></div>

        <div styleName="gender">性别

          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id="male" value="男" ref="male" />
            <label className="form-check-label" htmlFor="male">男</label>
          </div>

          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id="female" value="女" ref="female" />
            <label className="form-check-label" htmlFor="female">女</label>
          </div>

          {/*
          <input type="radio" name="gender" ref="male" />男
          <input type="radio" name="gender" ref="female" />女
          */}
        </div>

        <div>
          <input type="submit" className="btn btn-primary" value="注册" onClick={this.submit} />
        </div>

        {type == 'phone' ?
          <div><a href="javascript:void(0)" onClick={()=>{ self.setState({ type: 'email' }); }}>使用邮箱注册</a></div>
          :
          <div><a href="javascript:void(0)" onClick={()=>{ self.setState({ type: 'phone' }); }}>使用手机注册</a></div>}

      </div>
    )
  }

}
