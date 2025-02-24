# CMake 最低版本号要求
cmake_minimum_required (VERSION 3.18)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

set(PROJECT_COMPONENT_DIR ${CMAKE_CURRENT_SOURCE_DIR})
set(FX_3RDPARTY_DIR "3rdPartys")

# 项目信息
project (planet_earth_opengl)
 
set(SOURCES
    Source.cpp
    "${FX_3RDPARTY_DIR}/glad/src/glad.c"
)

list(APPEND allSubDir "Component")
list(APPEND allSubDir "${PROJECT_SOURCE_DIR}/include")
list(APPEND allSubDir ${FX_3RDPARTY_DIR})
list(APPEND allSubDir "${FX_3RDPARTY_DIR}/glfw-3.3.6/include")
list(APPEND allSubDir "${FX_3RDPARTY_DIR}/glm-0.9.9.8")
list(APPEND allSubDir "${FX_3RDPARTY_DIR}/glad/include")

INCLUDE_DIRECTORIES(${allSubDir})
LINK_DIRECTORIES("${FX_3RDPARTY_DIR}/glfw-3.3.6/lib/Win32/")

# 指定生成目标
add_executable(planet_earth_opengl ${SOURCES})

# 链接库文件名
target_link_libraries(planet_earth_opengl PRIVATE 
    glfw3dll.lib
)

 #  COMMAND copy /y $(ProjectDir)../data/*.* $(OutDir)
add_custom_command(
   TARGET ${PROJECT_NAME} 
   POST_BUILD
   COMMAND ${CMAKE_COMMAND} -E copy_if_different
        "$(ProjectDir)../data/*.*"
        "$(OutDir)"
) 

# 头文件目录
# target_include_directories(planet_earth_opengl PRIVATE  
#     ${allSubDir}
# )

# INCLUDE_DIRECTORIES（添加头文件目录）
# LINK_DIRECTORIES（添加需要链接的库文件目录）
# LINK_LIBRARIES（添加需要链接的库文件路径，注意这里是全路径）
# TARGET_LINK_LIBRARIES （设置要链接的库文件的名称）

# 链接库目录(如果有才需要)
# target_link_directories(planet_earth_opengl PUBLIC
#     "${FX_3RDPARTY_DIR}/glfw-3.3.6/lib/Win32/"
# )

# link_directories必须要放到add_executable前面，因为这个命令只对后续命令生效。
# target_link_libraries(hello-world PRIVATE hello)
# target_include_directories(hello-world PRIVATE hello)


# cmake -G "Visual Studio 10" ../.. && cmake-gui ../..
# cmake -G "Visual Studio 10 Win64" ../.. && cmake-gui ../..
# cmake -G "Visual Studio 15 2017  Win64" ..
# cmake -g " Visual Studio 9 2008"
# cmake -g " Visual Studio 9 2008 win64"

# if "%2"=="-32bit" (
#        cmake.exe .. -G "Visual Studio 9 2008"
# )
# if "%2"=="-64bit" (
#        cmake.exe .. -G "Visual Studio 9 2008 Win64"
# )

# rem Third parameter defines debug or release compilation
# if "%3"=="-Debug" (
#         cmake.exe --build . --target ALL_BUILD --config Debug
# )
# if "%3"=="-Release" (
#         cmake.exe --build . --target ALL_BUILD --config Release
# )

# IF(WIN32)
#     SET(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} /SUBSYSTEM:WINDOWS") 
# ENDIF(WIN32)

# cmake clean ../build
