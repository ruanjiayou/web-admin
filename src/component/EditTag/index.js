import React from 'react'
import Icon from '../Icon'
import { Observer, useLocalStore } from 'mobx-react-lite'
import { Input } from 'antd';
import { Wrap } from './style'

export default function EditTag(props) {
  const local = useLocalStore(() => ({
    edit: false,
    loading: false,
  }));
  return <Observer>{() => {
    if (local.edit) {
      return <div style={{ display: 'block', width: 90, }}>
        <Input disabled={local.loading} autoFocus addonAfter={<Icon type={local.loading ? 'loading' : 'check'} onClick={async (e) => {
          const oinput = e.currentTarget.parentElement.parentElement.previousElementSibling;
          if (!local.loading) {
            const v = oinput.value;
            if (v && props.save) {
              try {
                local.loading = true
                await props.save(v);
                local.edit = false;
              } catch (e) {

              } finally {
                local.loading = false
              }
            } else {
              local.edit = false;
            }
          }
        }} />} />
      </div>
    } else {
      return <Wrap>
        <Icon type="plus" onClick={() => {
          local.edit = true;
        }} />
      </Wrap>
    }
  }}</Observer>


}