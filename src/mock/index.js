// import Mock from 'mockjs';


// Mock.mock(/\/v1\/project\/listSearchPage/, 'post', (req) => {
//   console.log("req.body:"+req.body)
//   const reqbody = JSON.parse(req.body)
//   const pageSize = parseInt(reqbody.pagesize)||10 //默认大小为10
//   const page = parseInt(reqbody.pagenumber)||1
  
//   return Mock.mock({
//     'code': 1,
//     'message': '查询成功',
//     'data': {
//       'total': 100,
//       'current': page ,
//       'size': pageSize,
//       [`records|${pageSize}`]: [{ 
//         'id|+1':1,
//         'name': '@word(5)',
//         'status|1': ['未完成', '进行中', '已完成'],
//         'createUser':{
//           'realname':'@cname'
//         } ,
//         'createTime': '@date'
//       }]
//     }
//   });
// });

// Mock.mock(/\/v1\/equipment\/getDevice/, 'post', (req) => {
//   console.log("req.body:"+req.body)
//   const reqbody = JSON.parse(req.body)
//   const pageSize = parseInt(reqbody.pageSize)||10 //默认大小为10
//   const page = parseInt(reqbody.pageNumber)||1
  
//   return Mock.mock({
//     'code': 1,
//     'message': '查询成功',
//     'data': {
//       'pageNumber': page ,
//       'pageSize': pageSize,
//       [`devices|${pageSize}`]: [{ 
//         'serialNumber|+1':1,
//         'number':'@word(10)',
//         'name': '@word(5)',
//         'status|1': ['进行中', '已完成']
//       }]
//       ,'url':"this is a url"
//       ,'totalResults':23
//     }
//   });
// });

// Mock.mock(/\/v1\/user\/listSearchPage/, 'post', (req) => {
//   console.log("req.body:"+req.body)
//   const reqbody = JSON.parse(req.body)
//   const pageSize = parseInt(reqbody.pagesize)||10 //默认大小为10
//   const page = parseInt(reqbody.pagenumber)||1
  
//   return Mock.mock({
//     'code': 1,
//     'message': '查询成功',
//     'data': {
//       'total': 100,
//       'current': page ,
//       'size': pageSize,
//       [`records|${pageSize}`]: [{ 
//         'id|+1':1,
//         'realname': '@word(5)',
//         'privilege|0-4': 1
//       }]
//     }
//   });
// });
