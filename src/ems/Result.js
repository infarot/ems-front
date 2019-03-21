import React, {Component} from 'react'
import {getSeamstressResults} from "../util/APIUtils";
import {notification, Table} from "antd";
import LoadingIndicator from "../common/LoadingIndicator";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import {withRouter} from "react-router-dom";
import "./Result.css"

class Result extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            resultLoading: false
        }
    }

    getSResults = (params) => {
        this.setState({
            resultLoading: true
        });
        getSeamstressResults(params.id)
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        results: response,
                        resultLoading: false
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


    componentDidMount() {
        this._isMounted = true;
        const {match: {params}} = this.props;
        this.getSResults(params);

    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        const {results} = this.state;


        if (this.state.resultLoading) {
            return <LoadingIndicator/>
        }
        let seamstressName = '';
        let seamstressLastName = '';
        if (results.length > 0) {
            seamstressName = results[0].seamstress.name;
            seamstressLastName = results[0].seamstress.lastName;

        }
        let sorted = results.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        });
        const chartData = sorted.map(r => {
            return {
                name: r.date,
                result: r.percentageResult,

            }
        });

        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: 'Result',
                dataIndex: 'result',
                key: 'result',
                sorter: (a, b) => a.result - b.result,
            },
            {
                title: 'Shift',
                dataIndex: 'shift',
                key: 'shift',
            }

        ];
        let sorted1 = results.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
        });
        const dataSource = sorted1.map(r => {
            return {
                date: r.date,
                result: r.percentageResult.toFixed(2),
                shift: r.shift,
                key: r.id,
            }
        });

        return (
            <div>
                <br/>
                <h1>{seamstressName} {seamstressLastName}</h1>
                <ResponsiveContainer height={210} width="100%">
                <AreaChart
                    width={1000}
                    height={200}
                    data={chartData}
                    margin={{
                        top: 20, right: 30, left: 10, bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Area type="monotone" dataKey="result" stroke="#333333" fill="#bae7ff"/>
                </AreaChart>
                </ResponsiveContainer>
                <Table dataSource={dataSource} columns={columns}/>
            </div>
        )
    }
}

export default withRouter(Result)