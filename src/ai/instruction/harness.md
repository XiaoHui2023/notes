# Harness

Harness 是 ai 工作时接触外部世界的环境。

没有 harness，ai 只能在聊天里回答。接入 harness 后，ai 可以读文件、改文件、运行命令，再把结果读回来继续判断。

## Tool

Tool 是 harness 提供给 ai 的能力。

tool 本身也有 `name`、描述和参数。ai 会像判断 SKILL 一样，先看 tool 能做什么、需要什么输入，再决定是否使用这个 tool。

基础 tool 包括：

- 读写文件
- 执行 shell
- 执行 Python 代码，并读取打印信息

tool 也可以继续扩展，比如搜索网页、爬取网页。不同 tool 需要先安装，ai 才能使用。

## 自制SKILL

可以根据 harness 的特性，自己制作一个 SKILL，让 ai 学会一件复杂的事情。

比如让 ai 帮忙修改 Excel：

写一个财务表格，把最高的价格标红，把最便宜的价格标绿。

已知 ai 会运行 Python，就可以在 SKILL 中教它怎么读 Excel。

````markdown
# Excel 操作

## 读取 Excel

需要读取 `.xls` 文件时，使用 `xlrd`。

```python
import xlrd

book = xlrd.open_workbook(input_path, formatting_info=True)
sheet = book.sheet_by_index(0)

for row_idx in range(sheet.nrows):
    print(row_idx, sheet.row_values(row_idx))

for row_start, row_end, col_start, col_end in sheet.merged_cells:
    print("merged", row_start, row_end, col_start, col_end)
```

运行后读取打印信息，判断表头、价格列、合并单元格和已有数据。
````

把这个 SKILL 给 ai 后，ai 会按照教学执行 Python，读回 Excel 里的数据。根据 ReAct，读回结果以后还会继续判断下一步。

如果还要让 ai 写 Excel，就继续在 SKILL 中教 `xlwt`。

````markdown
## 写入 Excel

需要写 `.xls` 文件时，使用 `xlwt`。

```python
import xlwt

book = xlwt.Workbook()
sheet = book.add_sheet("财务")

highest_style = xlwt.easyxf("pattern: pattern solid, fore_colour red;")
lowest_style = xlwt.easyxf("pattern: pattern solid, fore_colour light_green;")

sheet.write(row_idx, col_idx, value)
sheet.write(row_idx, col_idx, highest_price, highest_style)
sheet.write(row_idx, col_idx, lowest_price, lowest_style)
sheet.write(row_idx, col_idx, xlwt.Formula("SUM(B2:B10)"))
sheet.write_merge(row_start, row_end, col_start, col_end, "说明文字")

book.save(output_path)
```

写入前先根据读取结果找出最高价格和最低价格。最高价格使用红色样式，最低价格使用绿色样式。需要合计时写 `SUM` 公式。
````

ai 根据读到的数据，继续写值、设置颜色、写 `SUM` 公式。改到它认为不需要继续改时，最后返回总结：改了哪些内容，输出了哪个文件。

为了让 ai 写得更规范，可以用渐进式披露。入口 SKILL 只写主要要求，把更细的内容放到参考文件里。

```
excel-skill/
  SKILL.md
  reference/
    read-excel.md
    write-excel.md
    style-excel.md
    finance-example.xls
```

`SKILL.md` 里可以这样引用其它文件：

```markdown
## 参考文件

- 需要读取 Excel 时，加载 [读取 Excel](./reference/read-excel.md)
- 需要写入 Excel 时，加载 [写入 Excel](./reference/write-excel.md)
- 需要设置颜色、边框、字体时，加载 [Excel 样式](./reference/style-excel.md)
- 需要参考示例表格时，读取 `./reference/finance-example.xls`
```

参考文件里可以放现成的 Excel、读写代码、样式约定和常见公式。这样，一个复杂 skill 就做好了。

## MCP

SKILL 终究是在本机上运行，是 ai 在用我们的电脑跑指令和脚本。

有些事情本机脚本做不了，比如生成图片、处理音频、处理视频。这类任务通常还需要另一个大模型，能力可能来自提供商的 API 服务，也可能来自自己有显卡的另一台电脑。

如果想让 ai 使用这些能力，就要把它们做成 tool。ai 不直接关心背后是本机脚本、云端 API，还是另一台机器；它只需要知道这个 tool 怎么调用、输入什么、返回什么。

MCP 就是 tool 的接口规范。它规定外部能力如何暴露给 ai：有哪些 tool、每个 tool 需要什么参数、会返回什么结果。

有了 MCP，搜索网页、爬取网页、生成图片、处理音频和视频，都可以用统一的方式接进 harness。

一个 MCP 配置文件大概像这样：

```json
{
  "mcpServers": {
    "image-tools": {
      "command": "python",
      "args": ["tools/mcp/image_server.py"],
      "env": {
        "IMAGE_API_KEY": "填入图片服务的 API key"
      }
    },
    "audio-tools": {
      "command": "python",
      "args": ["tools/mcp/audio_server.py"]
    }
  }
}
```

这里的 `image_server.py` 和 `audio_server.py` 负责把生成图片、处理音频这些能力暴露成 tool。ai 看到的是 tool 名字、参数和返回结果，真正调用的是后面的 API 服务或另一台机器。
