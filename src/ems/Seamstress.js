import React, {Component} from 'react';
import {getSeamstressList, getSeamstressListFromDateRange} from "../util/APIUtils";
import "./Seamstress.css"
import LoadingIndicator from "../common/LoadingIndicator";
import {Redirect, Link} from "react-router-dom";
import {
    Table, Input, Button, Icon, notification, DatePicker
} from 'antd';
import Highlighter from 'react-highlight-words';

const {RangePicker} = DatePicker;


class Seamstress extends Component {

    constructor(props) {
        super(props);
        this.getSeamstresses = this.getSeamstresses.bind(this);
        this.state = {
            searchText: '',
            ready: false,
            seamstress: [],
            isLoading: false,
            fromDate: '',
            toDate: '',
        };
    }

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
                             setSelectedKeys, selectedKeys, confirm, clearFilters,
                         }) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{width: 90, marginRight: 8}}
                >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{width: 90}}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({searchText: selectedKeys[0]});
    };

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({searchText: ''});
    };


    getSeamstresses() {
        this.setState({
            isLoading: true
        });
        if (this.state.fromDate.length > 1 && this.state.toDate.length > 1) {
            getSeamstressListFromDateRange(this.state.fromDate, this.state.toDate)
                .then(response => {
                    this.setState({
                        seamstress: response,
                        isLoading: false
                    })
                });
        } else {
            getSeamstressList()
                .then(response => {
                    this.setState({
                        seamstress: response,
                        isLoading: false
                    })
                }).catch(error => {
                if (error.status === 401) {
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
        }
    }


    componentDidMount() {
        this.getSeamstresses();
    }

    onChange = (dates, dateStrings) => {
        this.setState({fromDate: dateStrings[0], toDate: dateStrings[1]}, () => {
            this.getSeamstresses();
        });

    };

    render() {
        const {seamstress, isLoading} = this.state;

        if (isLoading) {
            return <LoadingIndicator/>
        }

        const columns = [
            {
                title: 'Lp',
                dataIndex: 'lp',
                key: 'lp',
            },
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
            }, {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            }, {
                title: 'Last name',
                dataIndex: 'lastName',
                key: 'lastName',
                ...this.getColumnSearchProps('lastName'),
            }, {
                title: 'Average',
                dataIndex: 'average',
                key: 'average',
                sorter: (a, b) => a.average - b.average,
            }, {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
                sorter: (a, b) => a.score - b.score,
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
            }
        ];


        let i = 0;
        const dataSource = seamstress.map(seamstress => {
            i++;
            return {
                lp: i,
                name: seamstress.name,
                lastName: seamstress.lastName,
                id: seamstress.id,
                average: seamstress.average,
                score: seamstress.score,
                key: seamstress.id,
                action: <Link to={{
                    pathname: `/result/${seamstress.id}`,
                }}>
                    <Button type="primary" size="small">Results</Button>
                </Link>
            }
        });
        if (!this.props.token) {
            return (
                <Redirect
                    to={{
                        pathname: '/login',
                    }}/>
            );
        } else {
            return (
                <div>
                    <br/>
                    <RangePicker
                        dateRender={(current) => {
                            const style = {};
                            if (current.date() === 1) {
                                style.border = '1px solid #1890ff';
                                style.borderRadius = '50%';
                            }
                            return (
                                <div className="ant-calendar-date" style={style}>
                                    {current.date()}
                                </div>
                            );
                        }}
                        onChange={this.onChange}
                        placeholder={this.state.fromDate.length > 1 ? [this.state.fromDate, this.state.toDate] : ['From', 'To']}
                    />
                    <Button
                        className="button" type="primary"
                        onClick={() => this.setState({fromDate: '', toDate: ''}, () => {
                            this.getSeamstresses();
                        })}>
                        Reset
                    </Button>
                    <br/><br/>
                    <Table bordered pagination={{pageSize: 25}} dataSource={dataSource} columns={columns}/>
                </div>)
        }
    }
}

export default Seamstress;