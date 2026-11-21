window.MODELS = [
  {
    id: 'us', country: '美国', name: '自由市场经济', politics: '联邦总统制',
    economy: '企业通过银行、股票和债券市场筹资，投资方向多由企业和投资者决定。政府通过监管、采购和税收影响资源配置。',
    governance: '总统领导行政部门，国会立法并决定联邦拨款，法院行使司法权。各州拥有自己的政府和立法权限。',
    channel: '联邦基建方案要经过国会拨款，许多项目还需州和地方政府执行。授权、施工和企业增加投资可能发生在不同年份。',
    sources: [
      {label: '美国政府门户 · 联邦权力分工', url: 'https://www.usa.gov/branches-of-government'},
      {label: '美国商务部 · 金融服务与资本市场', url: 'https://www.trade.gov/selectusa-financial-services-industry'}
    ]
  },
  {
    id: 'de', country: '德国', name: '社会市场经济', politics: '联邦议会制',
    economy: '市场竞争与法定社会保险并行。企业在市场上定价和投资，社会保险分担失业、疾病等风险。',
    governance: '联邦议院选举总理并监督政府。各州通过联邦参议院参与联邦立法，涉及州利益的部分法案须获得其同意。',
    channel: '衰退中，失业保险可缓冲家庭收入下降。调整需要各州同意的税收制度时，协商进度也会影响生效时间。',
    sources: [
      {label: '德国概况 · 社会市场经济', url: 'https://www.deutschland.de/en/topic/business/social-market-economy-in-germany-growth-and-prosperity'},
      {label: '德国概况 · 议会与联邦制度', url: 'https://www.deutschland.de/en/germany-facts-information-figures-worth-knowing'}
    ]
  },
  {
    id: 'se', country: '瑞典', name: '北欧福利经济', politics: '议会制君主立宪制',
    economy: '税收为覆盖广泛的公共服务筹资，企业在市场中竞争。工会与雇主组织通过集体谈判确定许多行业的工资条件。',
    governance: '议会决定首相人选，首相组阁。君主主要履行礼仪职责，地方和地区政府承担教育、医疗等服务。',
    channel: '扩大公共服务要同时考虑税源和地方用工能力。即使中央拨款及时到位，护士、教师的培养与招聘也需要时间。',
    sources: [
      {label: '经合组织 · 瑞典公共治理', url: 'https://www.oecd.org/en/publications/public-governance-monitor-of-sweden_086f9b89-en/full-report/component-4.html'},
      {label: '欧盟生活与工作条件改善基金会 · 集体谈判', url: 'https://www.eurofound.europa.eu/en/countries/sweden/collective-bargaining'},
      {label: '澳大利亚外交贸易部 · 瑞典制度概况', url: 'https://www.dfat.gov.au/geo/sweden/sweden-country-brief'}
    ]
  },
  {
    id: 'jp', country: '日本', name: '产业协调型经济', politics: '议会内阁制',
    economy: '私人企业承担生产和投资，政府通过产业政策支持特定技术及供应链。半导体是近年来公共支持的领域之一。',
    governance: '国会指名首相，内阁对国会集体负责。天皇依宪法履行象征性职责。',
    channel: '补助可以降低企业建设晶圆厂的初期成本。建厂、培养人才和取得订单各有周期，财政支出往往先于产出。',
    sources: [
      {label: '日本经济产业省 · 人工智能与半导体支持措施', url: 'https://www.meti.go.jp/shingikai/sankoshin/shin_kijiku/pdf/20250603_7.pdf'},
      {label: '日本众议院 · 日本国宪法', url: 'https://www.shugiin.go.jp/internet/itdb_english.nsf/html/statics/english/constitution_e.htm'}
    ]
  },
  {
    id: 'fr', country: '法国', name: '战略投资型经济', politics: '半总统制共和国',
    economy: '市场竞争与国家战略投资并行。“法国2030”计划通过公共投资支持工业脱碳、创新技术和生产能力建设。',
    governance: '总统由直选产生并任命总理，总理领导政府，政府向议会负责。国民议会的多数构成影响预算与改革的通过。',
    channel: '长期产业计划分期拨款，企业是否跟进投资会改变项目规模。议会对预算的调整还可能改变实施节奏。',
    sources: [
      {label: '法国总统府 · 法国2030投资计划', url: 'https://www.elysee.fr/emmanuel-macron/france2030'},
      {label: '法国总统府 · 第五共和国宪法', url: 'https://www.elysee.fr/en/french-presidency/constitution-of-4-october-1958'}
    ]
  },
  {
    id: 'cn', country: '中国', name: '社会主义市场经济', politics: '人民代表大会制度',
    economy: '宪法规定实行社会主义市场经济，公有制为主体，多种所有制经济共同发展。国有企业和民营企业均参与生产与投资。',
    governance: '中国共产党领导是宪法规定的制度特征。全国人民代表大会是最高国家权力机关，国务院是最高国家行政机关。',
    channel: '中央确定投资重点后，项目落地还取决于地方资金、银行融资和企业需求。信用扩张可能带动投资，也可能增加偿债压力。',
    sources: [
      {label: '国家统计局 · 中华人民共和国宪法（第1、3、6、11、15、57、85条）', url: 'https://www.stats.gov.cn/gk/tjfg/xgfxfg/202503/t20250312_1958942.html'}
    ]
  },
  {
    id: 'in', country: '印度', name: '联邦混合经济', politics: '联邦议会制共和国',
    economy: '私人企业与公共投资共同推动发展。各邦在基础设施、用地和公共服务方面的差异，会改变企业选址和扩大生产的条件。',
    governance: '总理领导的部长会议集体向人民院负责。中央与各邦分掌宪法列明的权限，联邦院代表各邦等组成单位。',
    channel: '全国基建投资要转化为就业，还需要各邦落实用地、配套设施与培训。同一笔支出可能在不同地区形成不同的就业增量。',
    sources: [
      {label: '世界银行 · 印度国别经济备忘录', url: 'https://thedocs.worldbank.org/en/doc/400139d320ead96a0ec624d3608d9b56-0310012025/original/India-Country-Economic-Memorandum-2024-0227c.pdf'},
      {label: '欧洲议会研究服务处 · 印度的议会与政治制度', url: 'https://www.europarl.europa.eu/thinktank/en/document/EPRS_BRI%282020%29649330'}
    ]
  },
  {
    id: 'sg', country: '新加坡', name: '开放贸易型经济', politics: '议会制共和国',
    economy: '国际贸易和跨境投资对这座城市国家影响很大。政府拥有的投资公司淡马锡自行作出商业投资决定。',
    governance: '总统是国家元首，任命获多数议员信任的议员为总理。总理领导内阁并主持日常施政，内阁向议会负责。',
    channel: '海外需求下降会很快传到出口企业。国内投资可以缓冲就业压力，但项目依赖的进口设备也会把一部分需求传到国外。',
    sources: [
      {label: '国际货币基金组织 · 新加坡经济评估', url: 'https://www.elibrary.imf.org/view/journals/002/2026/185/article-A001-en.xml'},
      {label: '淡马锡 · 所有权与投资决策', url: 'https://www.temasek.com.sg/en/about-us/faqs'},
      {label: '新加坡国会 · 内阁', url: 'https://www.parliament.gov.sg/about-us/structure/the-cabinet'}
    ]
  },
  {
    id: 'br', country: '巴西', name: '开发金融型经济', politics: '联邦总统制共和国',
    economy: '私人资本参与生产与投资，联邦所有的巴西国家经济社会发展银行为企业和基础设施提供长期融资。',
    governance: '总统由选民直接选举，国会设参议院和众议院。多党竞争下，总统推动立法通常需要在国会争取支持。',
    channel: '开发银行融资可以帮助回收期长的项目开工。若项目收入不足，贷款损失可能侵蚀银行资本，削弱后续放贷能力。',
    sources: [
      {label: '巴西开发银行 · 职能与长期融资', url: 'https://www.bndes.gov.br/wps/portal/site/home/quem-somos/quem-somos'},
      {label: '欧洲议会研究服务处 · 巴西议会及政治制度', url: 'https://www.europarl.europa.eu/RegData/etudes/BRIE/2021/659447/EPRS_BRI%282021%29659447_EN.pdf'}
    ]
  },
  {
    id: 'sa', country: '沙特阿拉伯', name: '资源转型型经济', politics: '君主专制政体',
    economy: '石油收入深刻影响财政和投资。“2030愿景”通过公共投资与吸引私人资本，推动旅游、物流和工业等非油产业发展。',
    governance: '国王任命大臣和协商会议成员。大臣会议承担行政职能，协商会议审议政策并提出建议。',
    channel: '油价下降会压缩政府可支配的收入。多元化投资有机会拓宽未来税源，但大型项目初期仍会占用财政资源。',
    sources: [
      {label: '沙特2030愿景 · 经济多元化目标', url: 'https://www.vision2030.gov.sa/en/overview/pillars/a-thriving-economy'},
      {label: '澳大利亚外交贸易部 · 沙特政体与经济', url: 'https://www.dfat.gov.au/geo/saudi-arabia/saudi-arabia-country-brief'}
    ]
  }
];
