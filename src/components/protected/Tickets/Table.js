import * as Table from 'reactabular-table';
import * as resolve from 'table-resolver';
import * as search from 'searchtabular';
import Pagination from './Pagination';
import React from 'react';
import Search from 'reactabular-search-field';
import VisibilityToggles from 'react-visibility-toggles';
import cloneDeep from 'lodash.clonedeep';
import { compose } from 'redux';

function paginate({ page, perPage }) {
  return (rows = []) => {
    // adapt to zero indexed logic
    const p = page - 1 || 0;

    const amountOfPages = Math.ceil(rows.length / perPage);
    const startPage = p < amountOfPages ? p : 0;

    return {
      amount: amountOfPages,
      rows: rows.slice(startPage * perPage, startPage * perPage + perPage),
      page: startPage,
    };
  };
}

export default class TicketsTable extends React.Component {
  constructor() {
    super();

    this.state = {
      searchColumn: 'all',
      pagination: {
        page: 1,
        perPage: 20,
      },
      rows: [],
      columns: [
        {
          property: 'company.name',
          header: {
            label: 'Company',
          },
          visible: true,
        },
        {
          property: 'project.name',
          header: {
            label: 'Project',
          },
          visible: true,
        },
        {
          property: 'id',
          header: {
            label: 'ID',
          },
          visible: true,
        },
        {
          property: 'phase.name',
          header: {
            label: 'Phase',
          },
          visible: false,
        },
        {
          property: 'summary',
          header: {
            label: 'Name',
          },
          visible: true,
        },
        {
          property: 'budgetHours',
          header: {
            label: 'Budget Hours',
          },
          visible: true,
        },
        {
          property: 'actualHours',
          header: {
            label: 'Actual Hours',
          },
          visible: true,
        },
        {
          property: 'status.name',
          header: {
            label: 'Status',
          },
          visible: true,
        },
        {
          property: 'billTime',
          header: {
            label: 'Billable',
          },
          visible: false,
        },
        {
          property: 'resources',
          header: {
            label: 'Resources',
          },
          visible: false,
        },
      ],
    };

    this.changePage = this.changePage.bind(this);
    this.search = this.search.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
  }

  componentDidMount() {
    this.prepareRows();
  }

  componentDidReceiveProps(nextProps) {
    if (this.props.tickets.length !== nextProps.tickets.length) {
      this.prepareRows();
    }
  }

  prepareRows() {
    const { tickets } = this.props;
    const { columns } = this.state;

    this.setState({
      rows: resolve.resolve({ columns, method: resolve.nested })(tickets),
    });
  }

  changePage(page) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        page,
      },
    });
  }

  search(query) {
    this.props.search(query);
  }

  toggleColumn({ columnIndex }) {
    const columns = cloneDeep(this.state.columns);
    columns[columnIndex].visible = !columns[columnIndex].visible;
    this.setState({ columns });
  }

  render() {
    const { query } = this.props;
    const { columns, pagination, rows } = this.state;
    const paginated = compose(
      paginate(pagination),
      search.multipleColumns({ columns, query })
    )(rows);
    const visibleColumns = columns.filter(column => column.visible);

    return (
      <div>
        <Search
          column={this.state.searchColumn}
          columns={columns}
          onChange={this.search}
          onColumnChange={searchColumn => this.setState({ searchColumn })}
          query={query}
          rows={rows}
        />
        <button 
          className="btn-link"
          onClick={this.search.bind(this, {})}
          type="button"
          style={{ marginBottom: '20px' }}
        >
          Clear Search
        </button>

        <div className="panel panel-default">
          <VisibilityToggles
            className="panel-body"
            columns={columns}
            onToggleColumn={this.toggleColumn}
          />
        </div>
        <Table.Provider
          className="table table-striped table-bordered"
          columns={visibleColumns}
        >
          <Table.Header>
            <search.Columns
              query={query}
              columns={visibleColumns}
              onChange={this.search}
            />
          </Table.Header>
          <Table.Body rowKey="id" rows={paginated.rows} />
        </Table.Provider>
        {paginated.amount > 1 && (
          <Pagination 
            changePage={this.changePage}
            paginated={paginated}
            pagination={pagination}
          />
        )}
      </div>
    );
  }
}

TicketsTable.defaultProps = {
};
