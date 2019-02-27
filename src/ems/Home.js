import React, {Component} from 'react'
import {getMonthStatistics, getShiftProduction} from "../util/APIUtils";
import {notification, Progress, Table} from "antd";
import LoadingIndicator from "../common/LoadingIndicator";
import "./Home.css"
import {withRouter} from "react-router-dom";

class Home extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            monthStat: [],
            month: 0,
            homeLoading: false
        }
    }

    getCurrentMonth = () => {
        this.setState({month: new Date().getMonth() + 1}, () => {
                this.getStat();
            }
        );
    };

    getStat = () => {
        this.setState({
            homeLoading: true
        });

        getMonthStatistics(this.state.month)
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        monthStat: response,
                        homeLoading: false
                    })
                }
            }).catch(error => {
            if (error.status === 401) {
                this.props.history.push('/login');
                notification.error({
                    message: 'EMS',
                    description: 'Please login first'
                });

            } else {
                notification.error({
                    message: 'EMS',
                    description: error.message || 'Something went wrong. Please try again'
                });
            }
        });
    };

    getShiftProd = () => {
        this.setState({
            homeLoading: true
        });

        getShiftProduction()
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        results: response,
                        homeLoading: false
                    })
                }
            }).catch(error => {
            if (error.status === 401) {
                this.props.history.push('/login');
                notification.error({
                    message: 'EMS',
                    description: 'Please login first'
                });

            } else {
                notification.error({
                    message: 'EMS',
                    description: error.message || 'Something went wrong. Please try again'
                });
            }
        });
    };

    componentDidMount() {
        this._isMounted = true;
        this.getCurrentMonth();
        this.getShiftProd();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const {results, monthStat} = this.state;

        if (this.state.homeLoading) {
            return <LoadingIndicator/>
        }

        const averagePerAll = monthStat.averagePerAll;
        const averageResult = monthStat.averageResult;
        const averageWorkOrganization = monthStat.averageWorkOrganization;


        const columns = [
            {
                align: 'center',
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                className: 'table-column',
            },
            {
                align: 'center',
                title: 'Result',
                className: 'table-column',
                dataIndex: 'result',
                key: 'result',
            },
            {
                className: 'table-column',
                align: 'center',
                title: 'Shift',
                dataIndex: 'shift',
                key: 'shift',
            },
            {
                className: 'table-column',
                align: 'center',
                title: 'Per sts',
                dataIndex: 'perSeamstress',
                key: 'perSeamstress',
            },
            {
                className: 'table-column',
                align: 'center',
                title: 'Per sts + qc',
                dataIndex: 'perSeamstressQc',
                key: 'perSeamstressQc',
            },
            {
                className: 'table-column',
                align: 'center',
                title: 'Per all',
                dataIndex: 'perEmployee',
                key: 'perEmployee',
            },
            {
                className: 'table-column',
                align: 'center',
                title: 'Potential ut.',
                dataIndex: 'potentialUtilization',
                key: 'potentialUtilization',
            },
            {
                className: 'table-column',
                align: 'center',
                title: 'Seamstress qt.',
                dataIndex: 'seamstressQuantity',
                key: 'seamstressQuantity',
            },
            {
                className: 'table-column',
                align: 'center',
                title: 'Efficiency',
                dataIndex: 'efficiency',
                key: 'efficiency',
            }

        ];

        const dataSource = results.map(r => {
            return {
                date: r.date,
                result: Math.round(r.result),
                shift: r.shift,
                perSeamstress: Math.round(r.perSeamstress),
                perSeamstressQc: Math.round(r.perSeamstressQc),
                perEmployee: Math.round(r.perEmployee),
                potentialUtilization:
                    r.potentialUtilization > 81 ?
                        <Progress strokeColor="#44EF29" status="normal" percent={Math.round(r.potentialUtilization)}/> :
                        <Progress strokeColor="#FFF700" status="normal" percent={Math.round(r.potentialUtilization)}/>,
                seamstressQuantity: Math.round(r.result / r.perSeamstress),
                efficiency:
                    Math.round(r.workOrganization) > 90 ?
                        <Progress width={50} strokeColor="#44EF29" type="circle"
                                  percent={Math.round(r.workOrganization)} format={percent => `${percent}`}/> :
                        <Progress strokeColor="#FFF700" width={50} type="circle"
                                  percent={Math.round(r.workOrganization)} format={percent => `${percent}`}/>,
                key: r.id,
            }
        });


        return (
            <div>
                <h2>Month statistics:</h2>
                <h1>Average per sts: {Math.round(averagePerAll)} | Average result: {Math.round(averageResult)} | Average efficiency: {Math.round(averageWorkOrganization) > 90 ?
                    <Progress width={70} strokeColor="#44EF29" type="circle"
                              percent={Math.round(averageWorkOrganization)} format={percent => `${percent}`}/> :
                    <Progress strokeColor="#FFF700" width={70} type="circle"
                              percent={Math.round(averageWorkOrganization)} format={percent => `${percent}`}/>}</h1>
                <Table bordered dataSource={dataSource} columns={columns}/>
            </div>
        )
    }
}

export default withRouter(Home)