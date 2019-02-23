import React, {Component} from 'react'
import {getSeamstressResults} from "../util/APIUtils";
import {notification, Table} from "antd";
import LoadingIndicator from "./Seamstress";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

class Result extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            isLoading: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const {match: {params}} = this.props;

        getSeamstressResults(params.id)
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        results: response,
                        isLoading: false
                    })
                }
            }).catch(error => {
            if (error.status === 401) {
                notification.error({
                    message: 'EMS',
                    description: 'You are not eligible to see this content'
                });
            } else {
                notification.error({
                    message: 'EMS',
                    description: error.message || 'Something went wrong. Please try again'
                });
            }
        });

    }

    componentWillUnmount() {
        this._isMounted = false;
    }



    render() {
        const {results, isLoading} = this.state;

        if (isLoading) {
            return <LoadingIndicator/>
        }

        const chartData = results.map(r => {
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
            },
            {
                title: 'Shift',
                dataIndex: 'shift',
                key: 'shift',
            }

        ];
        const seamstressName = results.map(r => r.seamstress.name);
        const seamstresslastName = results.map(r => r.seamstress.lastName);
        const dataSource = results.map(r => {
            return {
                date: r.date,
                result: r.percentageResult,
                shift: r.shift,
                key: r.id,
            }
        });

        return (
            <div>
                <br/>
                <h1>{seamstressName[0]} {seamstresslastName[0]}</h1>
                <AreaChart
                    width={1000}
                    height={200}
                    data={chartData}
                    margin={{
                        top: 20, right: 30, left: 10, bottom: 10,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="result" stroke="#333333" fill="#bae7ff" />
                </AreaChart>
                <Table dataSource={dataSource} columns={columns}/>
            </div>
        )
    }
}

export default Result