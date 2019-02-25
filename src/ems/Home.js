import React, {Component} from 'react'
import {getShiftProduction} from "../util/APIUtils";
import {notification, Table} from "antd";
import LoadingIndicator from "./Seamstress";
import "./Home.css"

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

        getShiftProduction()
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

        const columns = [
            {
                align: 'center',
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                className:'table-column',
            },
            {
                align: 'center',
                title: 'Result',
                className:'table-column',
                dataIndex: 'result',
                key: 'result',
            },
            {
                className:'table-column',
                align: 'center',
                title: 'Shift',
                dataIndex: 'shift',
                key: 'shift',
            },
            {
                className:'table-column',
                align: 'center',
                title: 'Per seamstress',
                dataIndex: 'perSeamstress',
                key: 'perSeamstress',
            },
            {
                className:'table-column',
                align: 'center',
                title: 'Per seamstress + qc',
                dataIndex: 'perSeamstressQc',
                key: 'perSeamstressQc',
            },
            {
                className:'table-column',
                align: 'center',
                title: 'Per all',
                dataIndex: 'perEmployee',
                key: 'perEmployee',
            },
            {
                className:'table-column',
                align: 'center',
                title: 'Potential utilization',
                dataIndex: 'potentialUtilization',
                key: 'potentialUtilization',
            },
            {
                className:'table-column',
                align: 'center',
                title: 'Work organization',
                dataIndex: 'workOrganization',
                key: 'workOrganization',
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
                potentialUtilization: Math.round(r.potentialUtilization),
                workOrganization: Math.round(r.workOrganization),
                key: r.id,
            }
        });

        return (
            <div>
                <Table bordered dataSource={dataSource} columns={columns}/>
            </div>
        )
    }
}

export default Result