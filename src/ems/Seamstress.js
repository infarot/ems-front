import React, {Component} from 'react';
import {getSeamstressList} from "../util/APIUtils";
import "./Seamstress.css"
import LoadingIndicator from "../common/LoadingIndicator";
import {Redirect, Link} from "react-router-dom";
import {
    Table, Input, Button, Icon, notification
} from 'antd';
import Highlighter from 'react-highlight-words';


class Seamstress extends Component {

    constructor(props) {
        super(props);
        this.getSeamstresses = this.getSeamstresses.bind(this);
        this.state = {
            searchText: '',
            ready: false,
            seamstress: [],
            isLoading: false
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
                    placeholder={`Search ${dataIndex}`}
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



    componentDidMount() {
        this.getSeamstresses();
    }

    render() {
        const {seamstress, isLoading} = this.state;
        /*

        */

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
                    pathname: `/result/${seamstress.id}`,}}>
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
            return <Table dataSource={dataSource} columns={columns}/>
        }
    }
}

export default Seamstress;