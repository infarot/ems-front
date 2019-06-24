import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {Card, Col, DatePicker, notification, Row, Select} from 'antd';
import {getProductionWorkerList, getQuiltingStatisticsByOperator} from "../util/APIUtils";

const {MonthPicker} = DatePicker;
const Option = Select.Option;

class QuiltingHistory extends Component {
    _isMounted = false;


    constructor(props) {
        super(props);
        this.state = {
            historyLoading: false,
            month: 0,
            year: 0,
            operatorId: 0,
            productionWorker: [],
            monthStats: []
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.getPW();
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    onChange = (date, dateString) => {
        this.setState({month: date.month() + 1, year: date.year()}, () => {
            this.getStat();
        });

    };

    handleSelect = (value) => {
        this.setState({operatorId: value}, () => {
            this.getStat();
        });
    };

    getPW = () => {
        this.setState({
            isLoading: true
        });

        getProductionWorkerList()
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        productionWorker: response,
                        isLoading: false
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

    getStat = () => {
        this.setState({
            isLoading: true
        });

        getQuiltingStatisticsByOperator(this.state.month, this.state.year, this.state.operatorId)
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        monthStats: response,
                        isLoading: false
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
        const {monthStats, productionWorker} = this.state;
        const averageLmt = monthStats.averageLmt;
        const averageTotalLoss = monthStats.averageTotalLoss;

        return (

            <div>
                <h1>
                    Please select operator and month
                </h1>
                <div className="history-month-picker">
                    <Select
                        style={{width: 200}}
                        showSearch
                        placeholder="Select operator"
                        filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                        onChange={this.handleSelect}>
                        {productionWorker.map(p => {
                            return <Option key={p.id} value={p.id}>{p.name} {p.lastName}</Option>
                        })}
                    </Select>
                </div>
                <div className="history-month-picker">
                    <MonthPicker style={{width: 200}} placeholder="Select month" onChange={this.onChange}/>
                </div>
                {averageLmt > 0 ?
                    <div>
                        <h2>
                            <div style={{background: "#FFFFFF"}}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Card size="small" title="Average quilted meters:" bordered={true}> <span
                                            className="quilting-table-qm-column"> {Math.round(averageLmt)} </span></Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card size="small" title="Average loss:" bordered={true}> <span
                                            className="quilting-table-loss-column">{averageTotalLoss > 0 ? (averageTotalLoss * 100).toFixed(4) : 0.0}%</span></Card>
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

export default withRouter(QuiltingHistory)