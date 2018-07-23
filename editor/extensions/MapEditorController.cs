namespace WCS.Server.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.Linq;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web.Http;
    using System.Web;
    using System.IO;
    using System.Net;
    using System.Threading.Tasks;
    using System.Diagnostics;
    using Model;

    /// <summary>
    /// 路径编辑器控制器
    /// </summary>
    [RoutePrefix("api/MapEditor")]
    public class MapEditorController : ControllerBase
    {
        /// <summary>
        /// 获取当前路径图
        [HttpGet, AllowAnonymous, Route("open")]
        public string open()
        {
            var svgData = string.Empty;

            var folderStr = HttpContext.Current.Server.MapPath("~/map");
            if (Directory.Exists(folderStr))
            {
                if (File.Exists(folderStr + "/map.svg"))
                {
                    using (StreamReader reader = new StreamReader(folderStr + "/map.svg"))
                    {
                        svgData = reader.ReadToEnd();
                    }
                }
            }
           
            //HttpResponseMessage response = new HttpResponseMessage();
            //response.Content = new StringContent(svgData);
            //response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/xml");
            return svgData;
        }

        /// <summary>
        /// 上传快照
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost, AllowAnonymous, Route("save")]
        public async Task<bool> save()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            Dictionary<string, string> dic = new Dictionary<string, string>();
            var folderStr = HttpContext.Current.Server.MapPath("~/map");
            if (!Directory.Exists(folderStr)) {
                Directory.CreateDirectory(folderStr);
            }
            var provider = new ReNameMultipartFormDataStreamProvider(folderStr);
            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                string svgData = string.Empty;
                var svgfile = provider.FileData.FirstOrDefault();
                if (svgfile != null)
                {
                    Trace.WriteLine("Server file path: " + svgfile.LocalFileName);//获取上传文件在服务上默认的文件名
                    using (StreamReader reader = new StreamReader(folderStr+"/"+ svgfile.LocalFileName)) {
                        svgData = reader.ReadToEnd();                      
                    }
                }

                if (provider.FormData.Count > 0)
                {
                    svgData = provider.FormData[0];
                    using (StreamWriter writer = new StreamWriter(folderStr + "/" + "map.svg"))
                    {
                        writer.Write(svgData);
                    }
                }

                if (!string.IsNullOrEmpty(svgData))
                {
                    var map = ConvertSvgToMap(svgData);
                    saveMap(map);
                    return true;
                }
                // This illustrates how to get the file names.
                //foreach (MultipartFileData file in provider.FileData)
                //{//接收文件
                //    //Trace.WriteLine(file.Headers.ContentDisposition.FileName);//获取上传文件实际的文件名
                //    //Trace.WriteLine("Server file path: " + file.LocalFileName);//获取上传文件在服务上默认的文件名
                //}//TODO:这样做直接就将文件存到了指定目录下，暂时不知道如何实现只接收文件数据流但并不保存至服务器的目录下，由开发自行指定如何存储，比如通过服务存到图片服务器
                //foreach (var key in provider.FormData.AllKeys)
                //{//接收FormData
                //    dic.Add(key, provider.FormData[key]);
                //}      
            }
            catch
            {
                throw;
            }
            return false;
        }

        public Map ConvertSvgToMap(string svgXml)
        {


            return null;
        }

        public void saveMap(Map map)
        {


        }

        public class Map {
            List<Route> routes { get; set; }
            List<CheckPoint> points { get; set; }
        }

        /// <summary>
        /// 重命名上传的文件
        /// </summary>
        public class ReNameMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
        {
            public ReNameMultipartFormDataStreamProvider(string root)
                : base(root)
            { }

            public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
            {
                //获取客户端文件名
                var originfileName = headers.ContentDisposition.FileName.TrimStart('\"').TrimEnd('\"');
                string name = Path.GetFileNameWithoutExtension(originfileName);
                var extension = Path.GetExtension(originfileName);
                var guid = Guid.NewGuid().ToString();
                return name + "_" + guid + extension;              
            }

        }

    }
}
