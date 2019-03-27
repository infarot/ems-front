import React, {Component} from 'react'
import {getQuiltingData, getQuiltingStatistics} from "../util/APIUtils";
import {Card, Col, notification, Row, Table} from "antd";
import LoadingIndicator from "../common/LoadingIndicator";
import {Link, withRouter} from "react-router-dom";
import "./Quilting.css"
import Button from "antd/lib/button";

class Quilting extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            quiltingData: [],
            quiltingStatistics: [],
            month: 0,
            year: 0,
            quiltingLoading: false,

        }
    }

    getCurrentMonthAndYear = () => {
        this.setState({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            }, () => {
                this.getQStats();
            }
        );
    };

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

    getQStats = () => {
        this.setState({
            quiltingLoading: true
        });
        getQuiltingStatistics(this.state.month, this.state.year)
            .then(response => {
                if (this._isMounted) {
                    this.setState({
                        quiltingStatistics: response,
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
        this.getCurrentMonthAndYear();
        this.getQData();


    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        const {quiltingData, quiltingStatistics} = this.state;


        if (this.state.quiltingLoading) {
            return <LoadingIndicator/>
        }

        const averageLmt = quiltingStatistics.averageLmt;
        const averageTotalLoss = quiltingStatistics.averageTotalLoss;


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
                <h2>
                    <Link to={{
                        pathname: `/quiltingHistory`,
                    }}>
                        <Button className="history-button" type="primary" size="small">More</Button>
                    </Link>
                </h2>
                <h2>Current month statistics
                </h2>
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