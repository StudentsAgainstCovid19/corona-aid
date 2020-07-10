# https://stackabuse.com/serving-files-with-pythons-simplehttpserver-module/
import http.server
import socketserver

PORT = 63342

handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("",PORT),handler) as httpd:
    print("Server started at localhost:" + str(PORT))
    httpd.serve_forever()