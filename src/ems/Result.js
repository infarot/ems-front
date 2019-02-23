import React, {Component} from 'react'
import {getSeamstressResults} from "../util/APIUtils";
import {notification, Table} from "antd";
import LoadingIndicator from "./Seamstress";


class Result extends Component {

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            isLoading: false
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props;

        getSeamstressResults(params.id)
            .then(response => {
                this.setState({
                    results: response,
                    isLoading: false
                })
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

    render() {

        const {results, isLoading} = this.state;
        /*

        */

        if (isLoading) {
            return <LoadingIndicator/>
        }

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
        const dataSource = results.map(r => {
            return {
                date: r.date,
                result: r.percentageResult,
                shift: r.shift,
                key: r.id,
            }
        });
        return <Table dataSource={dataSource} columns={columns}/>
    }
}

export default Result