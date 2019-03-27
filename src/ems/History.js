import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {Card, Col, DatePicker, notification, Progress, Row} from 'antd';
import {getMonthStatistics} from "../util/APIUtils";
import "./History.css"

const {MonthPicker} = DatePicker;

class History extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            historyLoading: false,
            month: 0,
            year: 0,
            monthStats: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onChange = (date, dateString) => {
        this.setState({month: date.month() + 1, year: date.year()}, () => {
            this.getStat();
        });

    };

    getStat = () => {
        this.setState({
            historyLoading: true
        });

        getMonthStatistics(this.state.month, this.state.year)
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        monthStats: response,
                        historyLoading: false
                    })
                }
            }).catch(error => {
            if (error.status === 401) {
                this.props.history.push('/login');

            } else {
                notification.error({
                    message: 'EMS',
                    description: error.message || 'Something went wrong. Please try again'
                });
            }
        });
    };

    render() {
        const {monthStats} = this.state;
        const averagePerAll = monthStats.averagePerAll;
        const averageResult = monthStats.averageResult;
        const averageWorkOrganization = monthStats.averageWorkOrganization;

        return (
            <div>
                <div className="history-month-picker">
                    <MonthPicker placeholder="Select month" onChange={this.onChange}/>
                </div>
                {averagePerAll > 0 ?
                    <div>
                        <h2>
                            <div style={{background: "#FFFFFF"}}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Card size="small" title="Average per sts:" bordered={true}>
                                            <span className="card-text"> {Math.round(averagePerAll)} </span></Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card size="small" title="Average result:" bordered={true}>
                                            <span className="card-text">{Math.round(averageResult)}</span></Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card size="small" title="Average efficiency:"
                                              bordered={true}> <span> {Math.round(averageWorkOrganization) > 90 ?
                                            <Progress width={70} strokeColor="#44EF29" type="circle"
                                                      percent={Math.round(averageWorkOrganization)}
                                                      format={percent => `${percent}`}/> :
                                            <Progress strokeColor="#FFF700" width={70} type="circle"
                                                      percent={Math.round(averageWorkOrganization)}
                                                      format={percent => `${percent}`}/>}</span></Card>
                                    </Col>
                                </Row>
                            </div>
                        </h2>
                    </div>
                    : null
                }

            </div>
        )
    }
}

export default withRouter(History)