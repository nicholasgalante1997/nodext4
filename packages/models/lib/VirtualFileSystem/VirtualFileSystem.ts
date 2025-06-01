/**
 * # AbstractVirtualFileSystem
 * 
 * Core Goals for the Virtual File System:
 * 1. Provide a unified filesystem interface to userspace programs
 * 2. Allow for different filesystem implementations to coexist on the same linux kernal
 * 
 * Core Concepts:
 * 
 * VFS implements various system calls such as:
 * 
 * - open(2)
 * - stat(2)
 * - chmod(2)
 * - read(2)
 * - write(2)
 * - + similar fileop system calls
 * 
 * ## The Directory Entry Cache, (dcache)
 * 
 */
abstract class AbstractVirtualFileSystem {}

class VirtualFileSystem extends AbstractVirtualFileSystem implements AbstractVirtualFileSystem {}

export { AbstractVirtualFileSystem, VirtualFileSystem };
export default VirtualFileSystem;
