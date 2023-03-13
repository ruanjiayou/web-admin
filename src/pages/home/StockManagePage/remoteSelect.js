import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import React, { useMemo, useRef, useState } from 'react';
import { Observer } from 'mobx-react-lite'
import apis from '../../../api'

function DebounceSelect({ fetchOptions, onChoose, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      onChange={e => {
        props.onChange && props.onChange(e);
        const stock = options.find(item => item.name === e.value)
        onChoose && onChoose(stock)
      }}
      options={options}
    />
  );
} // Usage of DebounceSelect

async function fetchStockList(q) {
  const resp = await apis.getStocks({ query: { q } })
  return resp.data.map((stock) => ({
    label: `${stock.se}${stock.code} ${stock.name}`,
    value: stock.name,
    name: stock.name,
    code: stock.code,
    se: stock.se
  }))
}

const App = ({ onChoose, placeholder, fetch }) => {
  const [value, setValue] = useState([]);
  return <Observer>{() => (
    <DebounceSelect
      // mode="multiple"
      showSearch
      onChoose={onChoose}
      value={value}
      placeholder={placeholder || "请输入"}
      fetchOptions={fetch || fetchStockList}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      style={{
        width: '100%',
      }}
    />
  )}</Observer>;
};

export default App;