 import Mock from 'mockjs';


Mock.mock(/\/v1\/project\/listAllPage/, 'post', (req) => {
  console.log("req.body:"+req.body)
  const reqbody = JSON.parse(req.body)
  const pageSize = parseInt(reqbody.params.pagesize)||10 //默认大小为10
  const page = parseInt(reqbody.params.pagenumber)||1
  
  return Mock.mock({
    'code': 1,
    'message': '查询成功',
    'data': {
      'total': 100,
      'current': page ,
      'size': pageSize,
      [`projects|${pageSize}`]: [{ 
        'id|+1':1,
        'name': '@word(5)',
        'status|1': ['未完成', '进行中', '已完成'],
        'person': '@cname',
        'datetime': '@date'
      }]
    }
  });
});

