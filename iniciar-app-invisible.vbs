Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
' Obtener la carpeta donde está este script
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)
' TODO EN PARALELO - Sin esperas
WshShell.Run "net start MSSQLSERVER", 0, False
WshShell.Run "cmd /c cd /d """ & scriptPath & "\BackendWellNuts"" && npm run dev", 0, False
WshShell.Run "cmd /c cd /d """ & scriptPath & "\FrontendWellNuts"" && npm run dev", 0, False
' Espera mínima de 1.5 segundos
WScript.Sleep 1500
' Abrir navegador inmediatamente
WshShell.Run "http://localhost:6001", 1, False