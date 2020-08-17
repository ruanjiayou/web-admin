# admin-demo

## TODO: list
- build analyse
- icons
- customiw-cra
- prefix
- group的修改思路：整颗root(含新建的)作为一个整体修改，保存origin和current。通过diff判断是否需要提交
  - $new $delete []的区分
  - 整棵树被删除的场景
  - 配合 tabindex 和虚线tag添加/删除
  - 预览表和正式表的区分