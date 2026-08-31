import { useEffect, useState, useRef, useCallback } from 'react'
import cytoscape, { type Core, type EventObject, type NodeSingular } from 'cytoscape'
import { fetchGraph } from '../services/api'
import { generateMockGraph } from '../services/mock'
import type { GraphData } from '../types/topic'

const subjectColors: Record<string, string> = {
  Science: '#4CAF50',
  Mathematics: '#2196F3',
  English: '#FF9800',
  History: '#9C27B0',
  'Personal & Social Development': '#E91E63',
  'Life Skills': '#00BCD4',
  Computing: '#607D8B',
  'Learning to Learn': '#795548',
}

export default function Graph() {
  const [data, setData] = useState<GraphData | null>(null)
  const [usingMock, setUsingMock] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [nodeInfo, setNodeInfo] = useState<GraphData['nodes'][0] | null>(null)
  const [search, setSearch] = useState('')
  const [activeSubjects, setActiveSubjects] = useState<Set<string>>(new Set())
  const [layoutName, setLayoutName] = useState<'cose' | 'circle' | 'concentric'>('cose')
  const [showPath, setShowPath] = useState(false)
  const [pathNodes, setPathNodes] = useState<{ id: string; label: string; subject: string }[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)

  // 加载数据
  useEffect(() => {
    fetchGraph()
      .then((d) => { setData(d); setUsingMock(false) })
      .catch(() => { setData(generateMockGraph()); setUsingMock(true) })
      .finally(() => {})
  }, [])

  // BFS 找最短路径
  const findPath = useCallback((targetId: string): string[] => {
    const cy = cyRef.current
    if (!cy) return []

    // 找所有根节点（无入边的节点）
    const roots = cy.nodes().filter((n) => n.incomers('edge').sources().length === 0)
    if (roots.length === 0) return [targetId]

    // 从每个根做 BFS，找最短路径到 target
    let shortestPath: string[] = []

    roots.forEach((root) => {
      const visited = new Set<string>()
      const queue: { id: string; path: string[] }[] = [{ id: root.id(), path: [root.id()] }]
      visited.add(root.id())

      while (queue.length > 0) {
        const current = queue.shift()!
        if (current.id === targetId) {
          if (shortestPath.length === 0 || current.path.length < shortestPath.length) {
            shortestPath = current.path
          }
          break
        }

        // 沿 hard 边遍历（前序依赖方向）
        const successors = cy.nodes(`[id="${current.id}"]`).outgoers('edge[strength="hard"]').targets()
        successors.forEach((succ) => {
          if (!visited.has(succ.id())) {
            visited.add(succ.id())
            queue.push({ id: succ.id(), path: [...current.path, succ.id()] })
          }
        })
      }
    })

    // 如果 hard 边找不到路径，尝试所有边
    if (shortestPath.length === 0) {
      roots.forEach((root) => {
        const visited = new Set<string>()
        const queue: { id: string; path: string[] }[] = [{ id: root.id(), path: [root.id()] }]
        visited.add(root.id())

        while (queue.length > 0) {
          const current = queue.shift()!
          if (current.id === targetId) {
            if (shortestPath.length === 0 || current.path.length < shortestPath.length) {
              shortestPath = current.path
            }
            break
          }

          const successors = cy.nodes(`[id="${current.id}"]`).outgoers('edge').targets()
          successors.forEach((succ) => {
            if (!visited.has(succ.id())) {
              visited.add(succ.id())
              queue.push({ id: succ.id(), path: [...current.path, succ.id()] })
            }
          })
        }
      })
    }

    return shortestPath
  }, [])

  // 高亮路径
  const highlightPath = useCallback((pathIds: string[]) => {
    const cy = cyRef.current
    if (!cy || pathIds.length === 0) return

    // 暗化所有
    cy.elements().addClass('dimmed')

    // 高亮路径节点
    const pathNodes = cy.collection()
    pathIds.forEach((id) => {
      const node = cy.$id(id)
      if (node.length > 0) {
        (pathNodes as any).merge(node)
      }
    })
    pathNodes.removeClass('dimmed').addClass('highlighted')

    // 高亮路径上的边
    for (let i = 0; i < pathIds.length - 1; i++) {
      const edge = cy.edges(`[source="${pathIds[i]}"][target="${pathIds[i + 1]}"]`)
      if (edge.length > 0) {
        edge.removeClass('dimmed').addClass('highlighted')
      }
      // 也检查反向边
      const edgeReverse = cy.edges(`[source="${pathIds[i + 1]}"][target="${pathIds[i]}"]`)
      if (edgeReverse.length > 0) {
        edgeReverse.removeClass('dimmed').addClass('highlighted')
      }
    }

    // 缩放到路径
    cy.animate({ fit: { eles: pathNodes, padding: 80 }, duration: 600 })
  }, [])

  // 初始化 Cytoscape
  useEffect(() => {
    if (!data || !containerRef.current) return

    const elements = [
      ...data.nodes.map((n) => ({
        data: { id: n.id, label: n.label, subject: n.subject, age: n.age || '' },
      })),
      ...data.edges.map((e, i) => ({
        data: { id: `e_${i}`, source: e.source, target: e.target, strength: e.strength },
      })),
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      minZoom: 0.2,
      maxZoom: 4,
      wheelSensitivity: 0.3,
      style: [
        // 节点
        {
          selector: 'node',
          style: {
            'background-color': (ele: NodeSingular) => subjectColors[ele.data('subject')] || '#94A3B8',
            'label': 'data(label)',
            'font-size': '9px',
            'color': '#334155',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'width': 12,
            'height': 12,
            'border-width': 1.5,
            'border-color': '#fff',
            'border-opacity': 0.8,
            'text-opacity': 0.7,
            'text-max-width': '80px',
            'text-wrap': 'ellipsis',
          } as cytoscape.Css.Node,
        },
        // 根节点标记
        {
          selector: 'node[[indegree = 0]]',
          style: {
            'width': 16,
            'height': 16,
            'border-width': 2,
            'border-color': '#F59E0B',
            'border-style': 'double',
          } as cytoscape.Css.Node,
        },
        // 选中
        {
          selector: 'node:selected',
          style: {
            'width': 22,
            'height': 22,
            'border-width': 3,
            'border-color': '#1E293B',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-opacity': 1,
          } as cytoscape.Css.Node,
        },
        // 高亮
        {
          selector: 'node.highlighted',
          style: {
            'width': 18,
            'height': 18,
            'border-width': 2.5,
            'border-color': '#3B82F6',
            'font-size': '10px',
            'font-weight': 'bold',
            'text-opacity': 1,
          } as cytoscape.Css.Node,
        },
        // 路径节点（特殊高亮）
        {
          selector: 'node.path-node',
          style: {
            'width': 20,
            'height': 20,
            'border-width': 3,
            'border-color': '#EF4444',
            'font-size': '10px',
            'font-weight': 'bold',
            'text-opacity': 1,
            'z-index': 10,
          } as cytoscape.Css.Node,
        },
        // 暗化
        {
          selector: 'node.dimmed',
          style: { 'opacity': 0.12 } as cytoscape.Css.Node,
        },
        // 搜索匹配
        {
          selector: 'node.search-match',
          style: {
            'width': 18,
            'height': 18,
            'border-width': 3,
            'border-color': '#F59E0B',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-opacity': 1,
            'background-color': '#F59E0B',
          } as cytoscape.Css.Node,
        },
        // 边 - hard
        {
          selector: 'edge[strength="hard"]',
          style: {
            'width': 1.5,
            'line-color': '#CBD5E1',
            'target-arrow-color': '#CBD5E1',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.6,
            'curve-style': 'bezier',
          } as cytoscape.Css.Edge,
        },
        // 边 - soft
        {
          selector: 'edge[strength="soft"]',
          style: {
            'width': 1,
            'line-color': '#E2E8F0',
            'line-style': 'dashed',
            'target-arrow-color': '#E2E8F0',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.5,
            'curve-style': 'bezier',
          } as cytoscape.Css.Edge,
        },
        // 边高亮
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#3B82F6',
            'target-arrow-color': '#3B82F6',
            'width': 2.5,
            'line-style': 'solid',
            'opacity': 1,
          } as cytoscape.Css.Edge,
        },
        // 路径边（红色）
        {
          selector: 'edge.path-edge',
          style: {
            'line-color': '#EF4444',
            'target-arrow-color': '#EF4444',
            'width': 3,
            'line-style': 'solid',
            'opacity': 1,
            'z-index': 10,
          } as cytoscape.Css.Edge,
        },
        // 边暗化
        {
          selector: 'edge.dimmed',
          style: { 'opacity': 0.06 } as cytoscape.Css.Edge,
        },
      ],
      layout: {
        name: layoutName,
        animate: true,
        animationDuration: 800,
        ...(layoutName === 'cose' ? {
          idealEdgeLength: 120,
          nodeOverlap: 20,
          refresh: 20,
          randomize: false,
          componentSpacing: 60,
          nodeRepulsion: 8000,
          edgeElasticity: 100,
          nestingFactor: 1.2,
          gravity: 0.25,
          numIter: 1500,
        } : {}),
        ...(layoutName === 'concentric' ? {
          concentric: (node: NodeSingular) => {
            const subjects = Object.keys(subjectColors)
            return subjects.length - subjects.indexOf(node.data('subject'))
          },
          levelWidth: () => 2,
          minNodeSpacing: 60,
        } : {}),
      } as cytoscape.LayoutOptions,
    })

    // 点击节点
    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target
      const nodeId = node.id()

      // 清除所有状态
      cy.elements().removeClass('highlighted dimmed path-node path-edge')

      if (selectedNode === nodeId) {
        setSelectedNode(null)
        setNodeInfo(null)
        setShowPath(false)
        setPathNodes([])
        return
      }

      // 高亮邻居
      const neighborhood = node.closedNeighborhood()
      cy.elements().addClass('dimmed')
      neighborhood.removeClass('dimmed').addClass('highlighted')

      setSelectedNode(nodeId)
      setNodeInfo(data.nodes.find((n) => n.id === nodeId) || null)
      setShowPath(false)
      setPathNodes([])

      // 计算路径（但不自动显示，等用户点击按钮）
      const path = findPath(nodeId)
      if (path.length > 1) {
        setPathNodes(path.map((id) => {
          const nd = data.nodes.find((n) => n.id === id)
          return { id, label: nd?.label || id, subject: nd?.subject || '' }
        }))
      } else {
        setPathNodes([])
      }
    })

    // 点击空白
    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted dimmed path-node path-edge')
        setSelectedNode(null)
        setNodeInfo(null)
        setShowPath(false)
        setPathNodes([])
      }
    })

    cyRef.current = cy

    return () => { cy.destroy() }
  }, [data, layoutName, findPath])

  // 切换路径显示
  const togglePath = useCallback(() => {
    if (showPath) {
      // 关闭路径，恢复邻居高亮
      const cy = cyRef.current
      if (!cy || !selectedNode) return
      cy.elements().removeClass('path-node path-edge dimmed highlighted')
      const node = cy.$id(selectedNode)
      if (node.length > 0) {
        const neighborhood = node.closedNeighborhood()
        cy.elements().addClass('dimmed')
        neighborhood.removeClass('dimmed').addClass('highlighted')
      }
      setShowPath(false)
    } else {
      // 显示路径
      if (selectedNode && pathNodes.length > 0) {
        highlightPath(pathNodes.map((n) => n.id))
        setShowPath(true)
      }
    }
  }, [showPath, selectedNode, pathNodes, highlightPath])

  // 搜索
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.elements().removeClass('search-match dimmed path-node path-edge')
    setShowPath(false)

    if (!search.trim()) return

    const q = search.toLowerCase()
    const matches = cy.nodes().filter((n) =>
      n.data('label').toLowerCase().includes(q) || n.data('subject').toLowerCase().includes(q)
    )

    if (matches.length > 0) {
      cy.elements().addClass('dimmed')
      matches.removeClass('dimmed').addClass('search-match')
      cy.animate({ fit: { eles: matches, padding: 50 }, duration: 500 })
    }
  }, [search])

  // 学科筛选
  const toggleSubject = useCallback((subject: string) => {
    setActiveSubjects((prev) => {
      const next = new Set(prev)
      if (next.has(subject)) next.delete(subject)
      else next.add(subject)
      return next
    })
  }, [])

  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    if (activeSubjects.size === 0) {
      cy.nodes().style('display', 'element')
      cy.edges().style('display', 'element')
    } else {
      cy.nodes().forEach((n) => {
        n.style('display', activeSubjects.has(n.data('subject')) ? 'element' : 'none')
      })
      cy.edges().forEach((e) => {
        const src = e.source().data('subject')
        const tgt = e.target().data('subject')
        e.style('display', activeSubjects.has(src) || activeSubjects.has(tgt) ? 'element' : 'none')
      })
    }
  }, [activeSubjects])

  // 重新布局
  const runLayout = useCallback(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.layout({
      name: layoutName,
      animate: true,
      animationDuration: 800,
      ...(layoutName === 'cose' ? {
        idealEdgeLength: 120,
        nodeRepulsion: 8000,
        gravity: 0.25,
        numIter: 1500,
      } : {}),
    } as cytoscape.LayoutOptions).run()
  }, [layoutName])

  // 重置
  const resetView = useCallback(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.elements().removeClass('highlighted dimmed search-match path-node path-edge')
    cy.nodes().style('display', 'element')
    cy.edges().style('display', 'element')
    setSelectedNode(null)
    setNodeInfo(null)
    setSearch('')
    setActiveSubjects(new Set())
    setShowPath(false)
    setPathNodes([])
    cy.fit(undefined, 50)
  }, [])

  const subjects = data ? [...new Set(data.nodes.map((n) => n.subject))] : []
  const rootCount = cyRef.current?.nodes().filter((n) => n.incomers('edge').sources().length === 0).length || 0

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold">知识图谱</h2>
          {usingMock && (
            <span className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded mt-1 inline-block">
              ⚠️ 演示数据
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {data && <span>{data.nodes.length} 节点 / {data.edges.length} 边</span>}
          {rootCount > 0 && (
            <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 rounded">
              🟡 {rootCount} 个入口节点
            </span>
          )}
        </div>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <input
          type="text"
          placeholder="🔍 搜索节点..."
          className="px-3 py-1.5 text-sm border rounded-lg w-52 bg-white dark:bg-gray-800 dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-2 py-1.5 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value as 'cose' | 'circle' | 'concentric')}
        >
          <option value="cose">力导向布局</option>
          <option value="circle">环形布局</option>
          <option value="concentric">同心圆布局</option>
        </select>
        <button onClick={runLayout} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700">
          🔄 重新布局
        </button>
        <button onClick={resetView} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700">
          ↺ 重置视图
        </button>
      </div>

      {/* 学科筛选 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs text-gray-400 mr-1">学科筛选：</span>
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => toggleSubject(s)}
            className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border transition-all ${
              activeSubjects.size === 0 || activeSubjects.has(s)
                ? 'border-transparent opacity-100'
                : 'border-gray-200 dark:border-gray-700 opacity-40'
            }`}
            style={activeSubjects.size === 0 || activeSubjects.has(s) ? {
              backgroundColor: subjectColors[s] + '18',
              borderColor: subjectColors[s] + '40',
            } : {}}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subjectColors[s] }} />
            <span>{s}</span>
          </button>
        ))}
      </div>

      {/* 主体 */}
      <div className="flex-1 flex gap-3 min-h-0">
        <div
          ref={containerRef}
          className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)]"
        />

        {/* 侧边面板 */}
        {nodeInfo && (
          <div className="w-72 bg-white dark:bg-gray-900 rounded-xl border border-[var(--color-border)] p-4 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">节点详情</h3>
              <button
                onClick={() => {
                  const cy = cyRef.current
                  if (cy) cy.elements().removeClass('highlighted dimmed path-node path-edge')
                  setSelectedNode(null)
                  setNodeInfo(null)
                  setShowPath(false)
                  setPathNodes([])
                }}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">名称</p>
                <p className="text-sm font-medium">{nodeInfo.label}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">ID</p>
                <p className="text-xs font-mono text-gray-500">{nodeInfo.id}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">学科</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subjectColors[nodeInfo.subject] }} />
                  <span className="text-sm">{nodeInfo.subject}</span>
                </div>
              </div>
              {nodeInfo.age && (
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">年龄段</p>
                  <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded">
                    {nodeInfo.age}
                  </span>
                </div>
              )}

              {/* 连接统计 */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 mb-1.5">连接</p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p>⬆ 前置依赖 (hard): {cyRef.current?.$id(nodeInfo.id).incomers('edge[strength="hard"]').sources().length || 0}</p>
                  <p>⬆ 软依赖 (soft): {cyRef.current?.$id(nodeInfo.id).incomers('edge[strength="soft"]').sources().length || 0}</p>
                  <p>⬇ 解锁: {cyRef.current?.$id(nodeInfo.id).outgoers('edge').targets().length || 0}</p>
                </div>
              </div>

              {/* 学习路径 */}
              {pathNodes.length > 1 && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-gray-400">📍 学习路径 ({pathNodes.length} 步)</p>
                    <button
                      onClick={togglePath}
                      className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                        showPath
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}
                    >
                      {showPath ? '清除路径' : '显示路径'}
                    </button>
                  </div>
                  <div className="space-y-0">
                    {pathNodes.map((pn, i) => (
                      <div key={pn.id} className="flex items-start gap-2">
                        {/* 连接线 */}
                        <div className="flex flex-col items-center w-4 shrink-0">
                          <div
                            className={`w-2.5 h-2.5 rounded-full border-2 ${
                              i === 0 ? 'bg-amber-400 border-amber-500' :
                              i === pathNodes.length - 1 ? 'bg-red-400 border-red-500' :
                              'bg-blue-300 border-blue-400'
                            }`}
                          />
                          {i < pathNodes.length - 1 && (
                            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                          )}
                        </div>
                        {/* 内容 */}
                        <div className="min-w-0 pb-1">
                          <p className={`text-xs leading-tight ${
                            i === pathNodes.length - 1 ? 'font-semibold text-red-600 dark:text-red-400' :
                            i === 0 ? 'text-amber-600 dark:text-amber-400' :
                            'text-gray-600 dark:text-gray-400'
                          }`}>
                            {pn.label}
                          </p>
                          <p className="text-[9px] text-gray-400">{pn.subject}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pathNodes.length <= 1 && selectedNode && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] text-gray-400">📍 入口节点（无前置依赖）</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
        <span>💡 点击节点高亮关联</span>
        <span>🟡 金色边框 = 入口节点</span>
        <span>🔴 红色路径 = 学习路径</span>
        <span>滚轮缩放 · 拖拽平移</span>
      </div>
    </div>
  )
}
