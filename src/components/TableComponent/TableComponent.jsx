/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Flex, Table } from "antd";
import { useState } from "react";
import { Excel } from "antd-table-saveas-excel";
import { ModalComponent } from "../ModalComponent/ModalComponent";

export const TableComponent = (props) => {
  const {
    dataTable = [],
    isLoading = false,
    columns,
    handleOkDeleteMany,
    titleDeleteMany,
    contentDeleteMany,
    sheet,
  } = props;

  const [isShowModalDelete, setIsShowModalDelete] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const protectedId = "669b2a2c4d1b9a66c1eb74f2";

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      // Exclude the protected ID from selected keys
      const filteredKeys = newSelectedRowKeys.filter(id => id !== protectedId);
      setSelectedRowKeys(filteredKeys);
    },
    onSelectAll: (selected, selectedRows) => {
      const newSelectedKeys = selected
        ? selectedRows
            .map(row => row.key)
            .filter(id => id !== protectedId)
        : [];
      setSelectedRowKeys(newSelectedKeys);
    },
    getCheckboxProps: (record) => ({
      // Disable checkbox for protected ID
      disabled: record.key === protectedId,
    }),
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleCancleDeleteMany = () => {
    setIsShowModalDelete(false);
  };

  const handleDeleteMany = () => {
    handleOkDeleteMany(selectedRowKeys);
    handleCancleDeleteMany();
  };

  const exportExcel = () => {
    const excel = new Excel();

    // Filter out the Action column
    const filteredColumns = columns.filter(
      (column) => column.key !== "index" && column.key !== "action"
    );

    const excelColumns = filteredColumns.map((col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key,
    }));
    excel
      .addSheet(sheet)
      .addColumns(excelColumns)
      .addDataSource(dataTable, {
        str2Percent: true,
      })
      .saveAs("TechTroveDecor.xlsx");
  };

  return (
    <div>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
          <Button
            className="rounded"
            type="primary"
            onClick={() => setIsShowModalDelete(true)}
            danger
            disabled={!hasSelected}
          >
            Delete Many
          </Button>
          <Button onClick={exportExcel}>Export Excel</Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flex>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataTable}
          isLoading={isLoading}
          {...props}
        />
      </Flex>
      <ModalComponent
        title={titleDeleteMany}
        open={isShowModalDelete}
        onCancel={handleCancleDeleteMany}
        onOk={handleDeleteMany}
      >
        <div className="">
          <h1>{contentDeleteMany}</h1>
        </div>
      </ModalComponent>
    </div>
  );
};
