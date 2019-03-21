import React, {Component} from 'react'
import {getQuiltingData} from "../util/APIUtils";
import {notification, Table} from "antd";
import LoadingIndicator from "../common/LoadingIndicator";
import {withRouter} from "react-router-dom";
import "./Quilting.css"

class Quilting extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            quiltingData: [],
            quiltingLoading: false,
        }
    }

    getQData = () => {
        this.setState({
            quiltingLoading: true
        });
        getQuiltingData()
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        quiltingData: response,
                        quiltingLoading: false
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

        this.getQData();

    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        const {quiltingData} = this.state;


        if (this.state.quiltingLoading) {
            return <LoadingIndicator/>
        }


        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                align: 'center',
            },
            {
                title: 'Operator',
                dataIndex: 'operator',
                key: 'operator',
                align: 'center',
                width: 200,
            },
            {
                title: 'Quilter 1',
                dataIndex: 'fq',
                key: 'fq',
                width: 90,
                align: 'center',
            },
            {
                title: 'Loss',
                dataIndex: 'fl',
                key: 'fl',
                width: 50,
                align: 'center',
            },
            {
                title: 'Quilter 2',
                dataIndex: 'sq',
                key: 'sq',
                width: 90,
                align: 'center',
            },
            {
                title: 'Loss',
                dataIndex: 'sl',
                key: 'sl',
                width: 50,
                align: 'center',
            },
            {
                title: 'Quilter 3',
                dataIndex: 'tq',
                key: 'tq',
                width: 90,
                align: 'center',
            },
            {
                title: 'Loss',
                dataIndex: 'tl',
                key: 'tl',
                width: 50,
                align: 'center',
            },
            {
                title: 'Total qm',
                dataIndex: 'qm',
                key: 'qm',
                align: 'center',
                className: 'quilting-table-qm-column',
                sorter: (a, b) => a.qm - b.qm,
            },
            {
                title: 'Total loss',
                dataIndex: 'tpl',
                key: 'tpl',
                align: 'center',
                className: 'quilting-table-loss-column',
            }

        ];
        const innerColumns = [
            {
                title: 'Quilter no.',
                dataIndex: 'quilterNumber',
                key: 'quilterNumber',
            },
            {
                title: 'Picker name',
                dataIndex: 'productionWorker.name',
                key: 'productionWorker.name',
            },
            {
                title: 'Picker last name',
                dataIndex: 'productionWorker.lastName',
                key: 'productionWorker.lastName',
            },
            {
                title: 'Item name',
                dataIndex: 'itemName',
                key: 'itemName',
            },
            {
                title: 'Quilted quantity',
                dataIndex: 'quantity',
                key: 'quantity',
            },
            {
                title: 'Rejected panels',
                dataIndex: 'rejectedQuantity',
                key: 'rejectedQuantity',
            }

        ];

        let sorted = quiltingData.sort((a, b) => {
            return new Date(b.date) - new Date(a.date)
        });

        const dataSource = sorted.map(r => {
            return {
                date: r.date,
                operator: r.operator.name + " " + r.operator.lastName,
                fq: r.quilterStatistics.lmtQ1.toFixed(2),
                sq: r.quilterStatistics.lmtQ2.toFixed(2),
                tq: r.quilterStatistics.lmtQ3.toFixed(2),
                fl: r.quilterStatistics.lossQ1 === "NaN" ? 0 : (r.quilterStatistics.lossQ1 * 100).toFixed(2) + "%",
                sl: r.quilterStatistics.lossQ2 === "NaN" ? 0 : (r.quilterStatistics.lossQ2 * 100).toFixed(2) + "%",
                tl: r.quilterStatistics.lossQ3 === "NaN" ? 0 : (r.quilterStatistics.lossQ3 * 100).toFixed(2) + "%",
                qm: Math.round(r.quilterStatistics.totalLmt),
                tpl: (r.quilterStatistics.totalLoss * 100).toFixed(3) + "%",
                qIndices: r.quiltedIndices,
                key: r.id,
            }
        });


        return (
            <div>
                <br/>
                <Table
                    bordered
                    columns={columns}
                    className="components-table-demo-nested"
                    expandedRowRender={(record, index, expanded) =>
                        expanded ?
                            <Table
                                rowKey={Math.random}
                                columns={innerColumns}
                                dataSource={record.qIndices}
                                pagination={false}
                            />
                            : null}
                    dataSource={dataSource}
                />
            </div>
        )
    }
}

export default withRouter(Quilting)